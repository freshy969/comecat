/** Handles all notification for new nessaage, socket and push */

var _ = require('lodash');
var async = require('async');
var request = require('request');
var fs = require('fs-extra');
var easyimg = require('easyimage');
var path = require("path");
var gm = require('gm');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require("../lib/utils");

var DatabaseManager = require('../lib/DatabaseManager');
var EncryptionManager = require('../lib/EncryptionManager');
var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');

var UpdateHistory = require("./UpdateHistory");
var NotifyNewMessage = require("./NotifyNewMessage");
var Permission = require("./Permission");

var HookModel = require('../Models/Hook');
var UserModel = require('../Models/User');
var MessageModel = require("../Models/Message");
var GroupModel = require('../Models/Group');
var RoomModel = require('../Models/Room');
var ChatbotSettingsModel = require('../Models/ChatbotSettings');

var NewUserLogic = require('./NewUser');
var SendMessageLogic = require('./SendMessage');

var facebookAdapter = require('../WebAPI/Connectors/adapters/Facebook');
var lineAdapter = require('../WebAPI/Connectors/adapters/Line');
var wechatAdapter = require('../WebAPI/Connectors/adapters/Wechat');
var viberAdapter = require('../WebAPI/Connectors/adapters/Viber');
var kikAdapter = require('../WebAPI/Connectors/adapters/Kik');
var telegramAdapter = require('../WebAPI/Connectors/adapters/Telegram');
var twilioAdapter = require('../WebAPI/Connectors/adapters/Twilio');


var ProcessExternalMessage = {

    process: function (serviceConfig, messageObj) {

        if (!messageObj.connectorIdentifier ||
            !messageObj.userIdentifier)

            return;

        const roomModel = RoomModel.get();
        const userModel = UserModel.get();
        const chatbotSettingsModel = ChatbotSettingsModel.get();

        const connectorIdentifier = messageObj.connectorIdentifier;
        const userIdentifier = messageObj.userIdentifier;
        const messageType = messageObj.messageType;
        const message = messageObj.text;
        const userId = serviceConfig.webhookIdentifier + connectorIdentifier + userIdentifier;

        if (messageType != Const.messageTypeText)
            return;

        let adapter = null;

        if (connectorIdentifier == 'facebook') {
            adapter = facebookAdapter;
        }
        else if (connectorIdentifier == 'line') {
            adapter = lineAdapter;
        }
        else if (connectorIdentifier == 'wechat') {
            adapter = wechatAdapter;
        }
        else if (connectorIdentifier == 'viber') {
            adapter = viberAdapter;
        }
        else if (connectorIdentifier == 'kik') {
            adapter = kikAdapter;
        }
        else if (connectorIdentifier == 'telegram') {
            adapter = telegramAdapter;
        }
        else if (connectorIdentifier == 'twilio') {
            adapter = twilioAdapter;
        }

        async.waterfall([(done) => {

            var result = {};

            // find a user
            userModel.findOne({
                userid: userId,
            }, (err, findResult) => {

                if (findResult)
                    result.guest = findResult.toObject();

                done(null, result);

            });

        },

        (result, done) => {

            if (!result.room) {
                if (adapter && adapter.getUserData) {
                    adapter.getUserData(serviceConfig, messageObj.originalData, (obj) => {
                        result.userData = obj;
                        done(null, result);
                    });
                } else {
                    done(null, result);
                }
            } else {
                done(null, result);
            }

        },

        (result, done) => {

            let avatarURL = null;

            if (result.userData &&
                result.userData.avatarURL)
                avatarURL = result.userData.avatarURL;

            generateAvatar(avatarURL, connectorIdentifier, (avatarData) => {

                result.avatarData = avatarData;
                done(null, result);

            });

        },

        (result, done) => {

            if (!result.guest) {

                let defaultName = "Guest User (" + connectorIdentifier + ")";

                if (result.userData && result.userData.name)
                    defaultName = result.userData.name + "(" + connectorIdentifier + ")";

                result.description = "";
                if (connectorIdentifier == "facebook")
                    result.description = " from facebook messenger";
                if (connectorIdentifier == "line")
                    result.description = " from line messenger";
                if (connectorIdentifier == "wechat")
                    result.description = " from wechat messenger";

                const params = {
                    name: defaultName,
                    description: result.description,
                    userid: userId,
                    password: "",
                    isGuest: 1,
                    organizationId: serviceConfig.organizationId.toString(),
                    created: Utils.now(),
                    status: 1
                };

                if (result.avatarData)
                    params.avatar = result.avatarData;

                var user = new userModel(params);

                user.save(function (err, saveResult) {

                    result.guest = saveResult.toObject();
                    done(err, result);

                });

            } else {

                done(null, result);

            }
        },

        (result, done) => {

            // find a room
            roomModel.findOne({
                "external.connectorIdentifier": connectorIdentifier,
                "external.userIdentifier": userIdentifier,
                "external.serviceSettingId": serviceConfig._id,
            }, (err, findResult) => {

                if (findResult)
                    result.room = findResult;

                done(null, result);

            });

        },

        (result, done) => {

            if (!result.room) {

                let defaultName = "Guest User (" + connectorIdentifier + ")";

                if (result.userData && result.userData.name)
                    defaultName = result.userData.name;

                const params = {
                    name: defaultName,
                    description: result.description,
                    organizationId: serviceConfig.organizationId.toString(),
                    users: [
                        serviceConfig.userId,
                        result.guest._id.toString()
                    ],
                    owner: Config.personalAccountAdminId,
                    description: "",
                    external: {
                        connectorIdentifier: connectorIdentifier,
                        userIdentifier: userIdentifier,
                        serviceSettingId: serviceConfig._id,
                    },
                    bot: {
                        botEnabled: 1,
                        botDisabledAt: 0
                    },
                    created: Utils.now(),
                    status: 1
                };

                if (result.avatarData)
                    params.avatar = result.avatarData;

                var room = new roomModel(params);

                room.save(function (err, saveResult) {

                    result.room = saveResult.toObject();

                    // send socket
                    SocketAPIHandler.emitToUser(serviceConfig.userId, 'new_room', {
                        conversation: result.room
                    });

                    // join
                    SocketAPIHandler.joinTo(serviceConfig.userId, Const.chatTypeRoom, result.room._id.toString());

                    done(err, result);

                });

            } else {

                done(null, result);

            }
        },

        (result, done) => {

            const params = {
                userID: result.guest._id,
                roomID: Const.chatTypeRoom + "-" + result.room._id,
                message: message,
                localID: Utils.getRandomString(),
                plainTextMessage: true,
                type: Const.messageTypeText,
                attributes: messageObj
            };

            SendMessageLogic.send(params, (err) => {

                done(err, result);

            }, (message) => {

                result.message = message;

                done(null, result);

            });

        },

        ],
            (err, result) => {

                if (err) {
                    console.error(err);
                    return;
                }

                console.log(result);

            });

    }

};

generateAvatar = function (url, serviceName, cb) {

    async.waterfall(
        [(done) => {

            result = {};

            if (url && url.length > 0) {
                request.get({ url: url, encoding: 'binary' }, (err, res, body) => {
                    result.response = body;
                    done(err, result);
                });
            } else
                done(null, result);


        },
        (result, done) => {

            // filename 
            const filePath = Config.uploadPath + "/" + Utils.getRandomString(32) + ".jpg";
            const socialMediaIcon = path.resolve(__dirname + "/../assets/socialicons/" + serviceName + ".png");
            result.filePath = filePath;

            if (result.response) {

                fs.writeFile(filePath, result.response, 'binary', function (err) {
                    done(err, result);
                });

            } else if (fs.existsSync(socialMediaIcon)) {

                const socialMediaIcon = path.resolve(__dirname + "/../assets/socialicons/" + serviceName + ".png");
                fs.copySync(socialMediaIcon, filePath);
                done(null, result);

            } else {

                done(err, result);

            }


        },
        (result, done) => {

            const socialMediaIcon = path.resolve(__dirname + "/../assets/socialicons/" + serviceName + ".png");

            const largeAvatarName = Utils.getRandomString(32);
            const largeAvatarPath = Config.uploadPath + "/" + largeAvatarName;

            if (result.response && fs.existsSync(socialMediaIcon)) {
                gm(result.filePath)
                    .resize(512, 512)
                    .composite(socialMediaIcon)
                    .geometry('+256+256')
                    .write(largeAvatarPath, function (err) {

                        if (!err)
                            result.largeAvatar = {
                                name: largeAvatarName,
                                path: largeAvatarPath
                            };

                        done(null, result);
                    });
            } else if (result.response) {
                gm(result.filePath)
                    .resize(512, 512)
                    .geometry('+256+256')
                    .write(largeAvatarPath, function (err) {

                        if (!err)
                            result.largeAvatar = {
                                name: largeAvatarName,
                                path: largeAvatarPath
                            };

                        done(null, result);
                    });
            } else if (fs.existsSync(socialMediaIcon)) {
                gm(result.filePath)
                    .resize(256, 256)
                    .write(largeAvatarPath, function (err) {

                        if (!err)
                            result.largeAvatar = {
                                name: largeAvatarName,
                                path: largeAvatarPath
                            };

                        done(null, result);
                    });
            } else {
                done(null, result);
            }


        },
        (result, done) => {

            const smallAvatarName = Utils.getRandomString(32);
            const smallAvatarPath = Config.uploadPath + "/" + smallAvatarName;

            if (!result.largeAvatar)
                return done(null, result);

            gm(result.largeAvatar.path)
                .resize(Const.thumbSize, Const.thumbSize)
                .write(smallAvatarPath, function (err) {
                    if (!err)
                        result.smallAvatar = {
                            name: smallAvatarName,
                            path: smallAvatarPath
                        }
                    done(null, result);
                });

        },
        (result, done) => {

            const avatar = {};

            if (result.largeAvatar) {

                avatar.picture = {};
                avatar.picture.originalName = result.largeAvatar.name;
                avatar.picture.mimeType = "image/jpg";
                avatar.picture.nameOnServer = result.largeAvatar.name;

                const stats = fs.statSync(result.largeAvatar.path);
                if (stats) {
                    const fileSizeInBytes = stats.size;
                    avatar.picture.size = fileSizeInBytes;
                }

            }

            if (result.smallAvatar) {

                avatar.thumbnail = {};
                avatar.thumbnail.originalName = result.smallAvatar.name;
                avatar.thumbnail.mimeType = "image/jpg";
                avatar.thumbnail.nameOnServer = result.smallAvatar.name;

                const stats = fs.statSync(result.smallAvatar.path);
                if (stats) {
                    const fileSizeInBytes = stats.size;
                    avatar.thumbnail.size = fileSizeInBytes;
                }

            }

            result.avatarData = avatar;

            done(null, result);

        },

        ],
        (err, result) => {

            if (err)
                console.log(err);

            cb(result.avatarData);

        });

}

module["exports"] = ProcessExternalMessage;
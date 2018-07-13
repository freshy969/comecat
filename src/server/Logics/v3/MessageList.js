/**  Search Room */

var _ = require('lodash');
var async = require('async');

var Const = require("../../lib/consts");
var Config = require("../../lib/init");
var Utils = require("../../lib/utils");


var DatabaseManager = require('../../lib/DatabaseManager');
var EncryptionManager = require('../../lib/EncryptionManager');

var MessageModel = require('../../Models/Message');
var FavoriteModel = require('../../Models/Favorite');

var PolulateMessageLogic = require('../../Logics/PolulateMessage');
var UpdateHistory = require('../../Logics/UpdateHistory');

var SocketAPIHandler = require('../../SocketAPI/SocketAPIHandler');

var MessageList = {

    get: function (userID, roomId, params, onSuccess, onError) {

        var messageModel = MessageModel.get();

        async.waterfall([function (done) {

            const conditions = {
                roomID: roomId
            };

            const query = messageModel.find(conditions, params.fields)
                .skip(params.offset)
                .sort(params.sort)
                .limit(params.limit);

            query.exec(conditions, (err, messages) => {

                done(err, messages);

            });

        },
        function (messages, done) {

            // handle seen by

            var messagesToNotifyUpdate = [];

            if (messages.length == 0) {

                done(null, {
                    messagesToNotifyUpdate: [],
                    messages: []
                });

                return;
            }

            async.eachSeries(messages, (message, doneEach) => {

                var seenBy = message.seenBy;

                if (!seenBy)
                    seenBy = [];

                var isExist = _.find(seenBy, (seenByRow) => {

                    return userID == seenByRow.user;

                });

                if (!isExist && message.userID != userID) {

                    // add seenby
                    seenBy.push({
                        user: userID,
                        at: Utils.now(),
                        version: 2
                    });

                    message.seenBy = seenBy;
                    messagesToNotifyUpdate.push(message._id.toString());

                    messageModel.update({
                        _id: message._id
                    }, {
                            seenBy: seenBy
                        }, (err, updateResult) => {

                            doneEach(err);

                        });

                } else {

                    doneEach();

                }

            }, (err) => {

                done(null, {
                    messagesToNotifyUpdate: messagesToNotifyUpdate,
                    messages: messages
                });

            });

        },
        function (result, done) {

            var messages = result.messages;
            var messageIdsToNotify = result.messagesToNotifyUpdate;

            if (messages.length > 0) {

                MessageModel.populateMessages(messages, function (err, data) {

                    done(null, data);

                    // send notification

                    var messagesToNotify = _.filter(data, (obj) => {

                        return messageIdsToNotify.indexOf(obj._id.toString()) != -1

                    });

                    // notify if exists
                    if (messagesToNotify.length > 0) {

                        var roomID = messagesToNotify[0].roomID;
                        var chatType = roomID.split("-")[0];
                        var roomIDSplitted = roomID.split("-");

                        // websocket notification
                        if (chatType == Const.chatTypeGroup) {

                            SocketAPIHandler.emitToRoom(roomID, 'updatemessages', messagesToNotify);

                        } else if (chatType == Const.chatTypeRoom) {

                            SocketAPIHandler.emitToRoom(roomID, 'updatemessages', messagesToNotify);

                        } else if (chatType == Const.chatTypePrivate) {

                            var splitAry = roomID.split("-");

                            if (splitAry.length < 2)
                                return;

                            var user1 = splitAry[1];
                            var user2 = splitAry[2];

                            var toUser = null;
                            var fromUser = null;

                            if (user1 == userID) {
                                toUser = user2;
                                fromUser = user1;
                            } else {
                                toUser = user1;
                                fromUser = user2;
                            }

                            SocketAPIHandler.emitToRoom(toUser, 'updatemessages', messagesToNotify);

                        }

                    };

                });

            } else {

                done(null, messages);
            }


        },
        function (messages, done) {

            // add favorite

            var favoriteModel = FavoriteModel.get();

            favoriteModel.find({
                userId: userID
            }, function (err, favoriteFindResult) {

                var messageIds = _.map(favoriteFindResult, function (favorite) {

                    return favorite.messageId;

                });

                var messagesFav = _.map(messages, function (message) {

                    var isFavorite = 0;

                    if (messageIds.indexOf(message._id.toString()) != -1)
                        isFavorite = 1;

                    message.isFavorite = isFavorite;

                    return message;

                });

                done(null, messagesFav);

            });

        }, function (result, done) {

            // update history
            UpdateHistory.resetUnreadCount({
                roomID: roomId,
                userID: userID
            });

            done(null, result);

        }, function (result, done) {

            // formate message json for API v3

            result = result.map((message) => {

                return {
                    id: message._id,
                    userID: message.userID,
                    roomID: message.roomID,
                    type: message.type,
                    message: message.message,
                    created: message.created,
                    user: message.user,
                    seenBy: message.seenBy,
                    isFavorite: message.isFavorite
                }

            });

            done(null, result);

        }
        ],
            function (err, result) {

                if (err) {
                    onError(err);
                    return;
                }

                onSuccess(result);

            });

    }

};


module["exports"] = MessageList;


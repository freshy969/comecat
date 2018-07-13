/** ping-ok Socket API  */

var _ = require('lodash');
var async = require('async');

var DatabaseManager = require("../lib/DatabaseManager");

var Utils = require("../lib/utils");
var Const = require("../lib/consts");
var Config = require("../lib/init");
var UpdateHistory = require('../Logics/UpdateHistory');

var SocketHandlerBase = require("./SocketHandlerBase");
var SocketAPIHandler = require("./SocketAPIHandler");

var GroupModel = require('../Models/Group');
var RoomModel = require('../Models/Room');
var UserModel = require('../Models/User');

var MessageModel = require('../Models/Message');

var OpenMessageActionHandler = function () {

}

_.extend(OpenMessageActionHandler.prototype, SocketHandlerBase.prototype);

OpenMessageActionHandler.prototype.attach = function (io, socket) {

    var self = this;

    /**
     * @api {socket} "openMessage" open unread message
     * @apiName openMessage
     * @apiGroup Socket 
     * @apiDescription set user online

     */
    socket.on('openMessage', function (param) {

        if (!param.messageID) {
            socket.emit('socketerror', { code: Const.resCodeSocketOpenMessageWrongMessageID });
            return;
        }

        if (!param.userID) {
            socket.emit('socketerror', { code: Const.resCodeSocketOpenMessageNoUserId });
            return;
        }

        var messageModel = MessageModel.get();

        async.waterfall([(done) => {

            var result = {};

            messageModel.findOne({
                _id: param.messageID
            }, (err, findResult) => {

                if (!findResult)
                    return;

                // do nothing for message sent user
                if (findResult.userID == param.userID)
                    return;

                result.isDelivered = !_.isEmpty(_.filter(findResult.deliveredTo, { userId: param.userID }));
                result.message = findResult;
                done(err, result);

            });

        },
        (result, done) => {

            if (result.isDelivered)
                return done(null, result);

            var deliveredToRow = {
                userId: param.userID,
                at: Utils.now(),
            };

            messageModel.update(
                { _id: param.messageID },
                {
                    $push: {
                        deliveredTo: deliveredToRow
                    }
                },
                (err, updateResult) => {

                    result.message.deliveredTo.push(deliveredToRow);
                    done(err, result);

                });

        },
        (result, done) => {

            if (param.doNotUpdateSeenBy)
                return done(null, result);

            var seenByRow = {
                user: param.userID,
                at: Utils.now(),
                version: 2
            };

            messageModel.update({
                _id: param.messageID
            }, {
                    $push: {
                        seenBy: seenByRow
                    }
                }, (err, updateResult) => {


                });

            result.message.seenBy.push(seenByRow);

            done(null, result);

        },
        (result, done) => {

            UpdateHistory.updateLastMessageStatus({
                messageId: param.messageID,
                delivered: true,
                seen: param.doNotUpdateSeenBy ? false : true
            }, (err) => {

                done(err, result);

            });

        },
        (result, done) => {

            MessageModel.populateMessages([result.message], function (err, data) {

                done(err, data[0]);

            });

        },
        (message, done) => {

            UpdateHistory.resetUnreadCount({
                roomID: message.roomID,
                userID: param.userID
            });

            done(null, message);

        }],

            (err, message) => {

                if (err) {
                    socket.emit('socketerror', { code: Const.resCodeSocketUnknownError });
                    return;
                }

                var chatType = message.roomID.split("-")[0];

                // websocket notification
                if (chatType == Const.chatTypeGroup) {

                    SocketAPIHandler.emitToRoom(message.roomID, 'updatemessages', [message]);

                } else if (chatType == Const.chatTypeRoom) {

                    SocketAPIHandler.emitToRoom(message.roomID, 'updatemessages', [message]);

                } else if (chatType == Const.chatTypePrivate) {

                    var splitAry = message.roomID.split("-");

                    if (splitAry.length < 2)
                        return;

                    var user1 = splitAry[1];
                    var user2 = splitAry[2];

                    var toUser = null;
                    var fromUser = null;

                    if (user1 == param.userID) {
                        toUser = user2;
                        fromUser = user1;
                    } else {
                        toUser = user1;
                        fromUser = user2;
                    }

                    SocketAPIHandler.emitToRoom(fromUser, 'updatemessages', [message]);
                    SocketAPIHandler.emitToRoom(toUser, 'updatemessages', [message]);

                }



            });

    });

}

module["exports"] = new OpenMessageActionHandler();
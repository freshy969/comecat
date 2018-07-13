/**  Called for /api/v2/test API */

const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const pathTop = "../../../";

const Const = require(pathTop + "lib/consts");
const Config = require(pathTop + "lib/init");
const Utils = require(pathTop + "lib/utils");

const DatabaseManager = require(pathTop + 'lib/DatabaseManager');
const checkAPIKey = require(pathTop + 'lib/authApiV3');
const APIBase = require('./APIBase');

const UserModel = require(pathTop + 'Models/User');
const ApiKeyModel = require(pathTop + 'Models/APIKey');
const MessageModel = require(pathTop + 'Models/Message');
const MessageLogic = require(pathTop + "Logics/v3/Message");
const SendMessageLogic = require(pathTop + "Logics/v3/SendMessage");
const EncryptionManager = require(pathTop + 'lib/EncryptionManager');

const ComcatAPIController = function () { }

_.extend(ComcatAPIController.prototype, APIBase.prototype);

ComcatAPIController.prototype.init = function (app) {

    const self = this;

    /**
     * @api {post} /api/v3/cc/send send messsage
     **/
    router.post('/send', (request, response) => {

        var message = request.body.message;
        var roomID = request.body.roomID;
        var userModel = UserModel.get();
        var apikeyModel = ApiKeyModel.get();
        var apikey = request.headers.apikey;

        if (!apikey) {
            response.status(Const.httpCodeBadParameter).send('Bad API Key');
            return;
        }

        if (!roomID) {
            response.status(Const.httpCodeBadParameter).send('Bad Parameter');
            return;
        }

        if (!message) {
            response.status(Const.httpCodeBadParameter).send('Bad Parameter');
            return;
        }

        async.waterfall([(done) => {

            // find apikey
            apikeyModel.findOne({
                key: apikey
            }, (err, findResult) => {

                if (!findResult)
                    return response.status(Const.httpCodeBadParameter).send('Wrong API Key');

                done(err, { apikey: findResult.toObject() })
            });

        }, function (result, done) {

            // find user
            userModel.findOne({
                _id: result.apikey.userId,
            }, (err, findResult) => {

                if (!findResult) {
                    return response.status(Const.httpCodeBadParameter).send('Wrong API Key');
                }

                result.user = findResult.toObject();

                done(null, result);

            });

        }, function (result, done) {

            const params = {
                userID: result.user._id,
                roomID: roomID,
                message: message,
                localID: Utils.getRandomString(),
                plainTextMessage: true,
                type: Const.messageTypeText,
                attributes: request.body.attributes
            };

            SendMessageLogic.send(params, (err) => {

                done(err, result);

            }, (message) => {

                result.message = message;

                done(null, result);

            });

        }
        ],
            (err, result) => {

                if (err) {
                    response.status(500).send("Server Error");
                    return;
                }

                const messageData = {
                    "id": result.message._id,
                    "message": result.message.message,
                    "roomID": result.message.roomID,
                    "created": result.message.created
                };
                const userData = {
                    "id": result.user._id,
                    "name": result.user.name,
                    "avatar": result.user.avatar,
                    "description": result.user.description,
                    "organizationId": result.user.organizationId,
                    "sortName": result.user.sortName,
                    "userid": result.user.userid,
                    "created": result.user.created
                };

                self.successResponse(response, Const.responsecodeSucceed,
                    { "message": messageData, "user": userData }
                );

            });
    });

    /**
      * @api {put} /api/v3/messages/:messageId just test
      **/
    router.put('/:messageId', checkAPIKey, (request, response) => {
        const messageId = request.params.messageId;
        const newMessageText = request.body.message;

        async.waterfall([
            (done) => {
                if (!mongoose.Types.ObjectId.isValid(messageId)) {
                    done({
                        code: Const.httpCodeBadParameter,
                        message: Const.errorMessage.messageidIsWrong
                    }, null);
                } else {
                    done(null, null);
                }
            },
            // get message model
            (result, done) => {
                const messageModel = MessageModel.get();
                messageModel.findOne({ _id: messageId }, (err, found) => {
                    if (!found) {
                        return done({
                            code: Const.httpCodeBadParameter,
                            message: Const.errorMessage.messageNotExist
                        }, null);
                    }
                    done(err, found);
                });
            },
            // Validate sender
            (oldMessage, done) => {
                if (oldMessage.user.toString() != request.user._id) {
                    done({
                        code: Const.httpCodeForbidden,
                        message: Const.errorMessage.cannotUpdateMessage
                    }, null);
                } else {
                    done(null, oldMessage);
                }
            },
            // Validate presence of parameters
            (oldMessage, done) => {
                const values = { messageId: messageId, message: newMessageText };
                self.validatePresence(values, (err) => {
                    done(err, oldMessage);
                });
            }
        ],
            (err, oldMessage) => {
                if (!_.isEmpty(err))
                    return response.status(err.code).send(err.message);

                MessageLogic.update(oldMessage, newMessageText, (updatedRoom) => {
                    self.successResponse(response, Const.responsecodeSucceed);
                }, (err) => {
                    console.log("Critical Error", err);
                    return self.errorResponse(response, Const.httpCodeServerError);
                });
            });
    });

    router.delete('/:messageId', checkAPIKey, (request, response) => {
        const messageId = request.params.messageId;

        async.waterfall([
            (done) => {
                if (!mongoose.Types.ObjectId.isValid(messageId)) {
                    done({
                        code: Const.httpCodeBadParameter,
                        message: Const.errorMessage.messageidIsWrong
                    }, null);
                } else {
                    done(null, null);
                }
            },
            // get room which should be deleted
            (result, done) => {
                const messageModel = MessageModel.get();
                messageModel.findOne({ _id: messageId }, (err, found) => {
                    if (!found) {
                        return done({
                            code: Const.httpCodeBadParameter,
                            message: Const.errorMessage.messageNotExist
                        }, null);
                    }
                    done(err, found);
                });
            },
            // Validate sender
            (oldMessage, done) => {
                if (oldMessage.user.toString() != request.user._id) {
                    done({
                        code: Const.httpCodeForbidden,
                        message: Const.errorMessage.cannotDeleteMessage
                    }, null);
                } else {
                    done(null, oldMessage);
                }
            }
        ],
            (err, oldMessage) => {
                if (!_.isEmpty(err))
                    return response.status(err.code).send(err.message);

                MessageLogic.delete(oldMessage, (updatedRoom) => {
                    self.successResponse(response, Const.responsecodeSucceed);
                }, (err) => {
                    console.log("Critical Error", err);
                    return self.errorResponse(response, Const.httpCodeServerError);
                });
            })
    });

    return router;
}

module["exports"] = new ComcatAPIController();

/** Called for /api/v2/room/leave Leave API */

var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var validator = require('validator');
var fs = require('fs-extra');

var pathTop = "../../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var DatabaseManager = require(pathTop + 'lib/DatabaseManager');
var Utils = require(pathTop + 'lib/utils');
var UserModel = require(pathTop + 'Models/User');
var RoomModel = require(pathTop + 'Models/Room');
var FavoriteModel = require(pathTop + 'Models/Favorite');

var HistoryModel = require(pathTop + 'Models/History');
var tokenChecker = require(pathTop + 'lib/authApi');

var SocketAPIHandler = require(pathTop + 'SocketAPI/SocketAPIHandler');

var BackendBase = require('../BackendBase');

var EnableBotController = function () { }


_.extend(EnableBotController.prototype, BackendBase.prototype);

EnableBotController.prototype.init = function (app) {

    var self = this;

    /**
      * @api {post} /api/v2/room/enablebot enable bot for the room
      * @apiName Enable Bot
      * @apiGroup WebAPI
      * @apiHeader {String} access-Token Users unique access-token.
      * @apiDescription Leave from joined room.
      * @apiParam {string} roomId roomId
      * @apiSuccessExample Success-Response:
     
 {
     success: 1,
     data: {
     }
 }
 
     */

    router.post('/', tokenChecker, function (request, response) {

        var roomId = request.body.roomId;
        var enabled = request.body.enabled;
        var loginUserId = request.user.get("id");

        var roomModel = RoomModel.get();
        var favoriteModel = FavoriteModel.get();

        roomModel.findOne({ _id: roomId }, function (err, room) {

            if (err) {

                self.successResponse(response, Const.responsecodeEnableBotWrongRoomId);

                return;
            }

            if (!room) {

                self.successResponse(response, Const.responsecodeEnableBotWrongRoomId);

                return;

            }

            room.update({
                "bot.botEnabled": enabled
            }, {}, function (err, updateResult) {

                if (err) {
                    console.log(err);
                    self.errorResponse(response, Const.httpCodeServerError);
                    return;
                }

                self.successResponse(response, Const.responsecodeSucceed);

            });

        });

    });

    return router;
}

module["exports"] = new EnableBotController();

/**  Called for /api/v2/test API */

var _ = require('lodash');
var express = require('express');
var router = express.Router();

var pathTop = "../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var SocialBase = require('./SocialBase');

var Connector = require(pathTop + 'Models/Connector');
var FacebookAdapter = require('./adapters/Facebook');
var LineAdapter = require('./adapters/Line');
var ViberAdapter = require('./adapters/Viber');
var KikAdapter = require('./adapters/Kik');
var TelegramAdapter = require('./adapters/Telegram');
var TwilioAdapter = require('./adapters/Twilio');
var WechatAdapter = require('./adapters/Wechat');

var ProcessExternalMessage = require(pathTop + "Logics/ProcessExternalMessage");

var SocialMain = function () {
}

_.extend(SocialMain.prototype, SocialBase.prototype);

SocialMain.prototype.init = function (app) {

    var self = this;

    const connectorModel = Connector.get();

    router.all('/:webhookIdentifier', function (request, response) {

        const webhookIdentifier = request.params.webhookIdentifier;

        console.log('webhook received', request.query, request.body, request.header);

        // get setting
        connectorModel.findOne({
            webhookIdentifier: webhookIdentifier
        }, (err, findResult) => {

            if (err)
                return self.errorResponse(response, Const.httpCodeServerError);

            if (!findResult)
                return self.errorResponse(response, Const.httpCodeBadParameter);

            if (findResult.connectorIdentifier == 'facebook') {

                FacebookAdapter.process(request, response, findResult.toObject(), processMessage);

            }
            else if (findResult.connectorIdentifier == 'line') {

                LineAdapter.process(request, response, findResult.toObject(), processMessage);

            } else if (findResult.connectorIdentifier == 'viber') {

                ViberAdapter.process(request, response, findResult.toObject(), processMessage);

            } else if (findResult.connectorIdentifier == 'kik') {

                KikAdapter.process(request, response, findResult.toObject(), processMessage);

            } else if (findResult.connectorIdentifier == 'wechat') {

                WechatAdapter.process(request, response, findResult.toObject(), processMessage);

            } else if (findResult.connectorIdentifier == 'telegram') {

                TelegramAdapter.process(request, response, findResult.toObject(), processMessage);

            } else if (findResult.connectorIdentifier == 'twilio') {

                TwilioAdapter.process(request, response, findResult.toObject(), processMessage);


            } else
                self.errorResponse(response, Const.httpCodeBadParameter);

        });

        function processMessage(serviceConfig, obj) {

            if (obj.messageType != Const.messageTypeText)
                return;

            ProcessExternalMessage.process(serviceConfig, obj);

        }


    });


    return router;
}

module["exports"] = new SocialMain();

var _ = require('lodash');
var express = require('express');
var request = require('request');
var crypto = require('crypto');
var line = require('@line/bot-sdk');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var ConnectorModel = require(pathTop + 'Models/Connector');
var DatabaseManager = require(pathTop + 'lib/DatabaseManager');
var connectorModel = ConnectorModel.get();

var LineAdapter = function () {
}

LineAdapter.prototype.init = function (app) {
}

LineAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        res.sendStatus(403);

    }

    if (req.method == 'POST') {

        const data = req.body;
        const signatureOrig = req.headers['x-line-signature'];

        if (!signatureOrig)
            return res.sendStatus(422);

        if (!data.events)
            return res.sendStatus(422);

        if (data.events.length < 1)
            return res.sendStatus(422);

        if (!config)
            return res.sendStatus(500);

        if (!config.settings)
            return res.sendStatus(500);

        if (!config.settings.secret)
            return res.sendStatus(500);

        if (!config.settings.accessToken)
            return res.sendStatus(500);

        const channelSecret = config.settings.secret;
        const body = req.rawBody; // Request body string

        const signatureGenerated = crypto.createHmac('SHA256', channelSecret).update(body).digest('base64');

        // process if signature is matched
        if (signatureGenerated == signatureOrig) {

            // Iterate over each entry - there may be multiple if batched
            data.events.forEach((event) => {

                if (event.type == 'message') {

                    if (event.message.type == 'text')
                        processMessage(
                            config,
                            {
                                connectorIdentifier: "line",
                                userIdentifier: event.source.userId,
                                messageType: Const.messageTypeText,
                                text: event.message.text,
                                originalData: data
                            });
                    else {

                        processMessage(
                            config,
                            {
                                connectorIdentifier: "line",
                                userIdentifier: event.source.userId,
                                messageType: Const.messageTypeText,
                                text: "Unsupported message:" + event.message.type,
                                originalData: data
                            });
                    }

                } else {

                    processMessage(
                        config,
                        {
                            connectorIdentifier: "line",
                            userIdentifier: event.source.userId,
                            messageType: Const.messageTypeText,
                            text: "Unsupported message:" * event.type,
                            originalData: data
                        });

                }

            });

            res.send('ok');

            return true;

        } else {

            connectorModel.update
                ({
                    _id: config._id
                }, {
                    status: Const.integrationStateDisabled,
                    error: "Invalid Secret"
                }, (err, findResult) => {



                });

            res.send('ok');

        }

    }

}

LineAdapter.prototype.sendMessage = function (settings, messageToLine) {

    return new Promise((res, rej) => {

        if (!messageToLine) return rej('message');
        if (!messageToLine.room) return rej('message');

        const room = messageToLine.room.toObject();

        if (!room.external) return rej('invalid params');
        if (!settings.settings || !settings.settings.accessToken) return res(null);
        if (messageToLine.type != Const.messageTypeText) return res(null);

        const targetUserId = room.external.userIdentifier;

        const client = new line.Client({
            channelAccessToken: settings.settings.accessToken
        });

        let message = {
            type: 'text',
            text: messageToLine.message
        };

        if (messageToLine.attributes &&
            messageToLine.attributes.serviceSpecific) {
            message = messageToLine.attributes.serviceSpecific;
        }

        client.pushMessage(targetUserId, message)
            .then((result) => {

                res(result);

            })
            .catch((err) => {

                console.log(err);

                /*
                rej({
                    message: err.message,
                    stack: err.stack,
                    statusCode: err.statusCode,
                    statusMessage: err.statusMessage,
                });
                */

            });
    });

}

LineAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {

    if (!serviceConfig.settings ||
        !serviceConfig.settings.accessToken ||
        !messageData.events ||
        messageData.events.length == 0 ||
        !messageData.events[0] ||
        !messageData.events[0].source ||
        !messageData.events[0].source.userId)

        return cb(null);

    const userId = messageData.events[0].source.userId;

    const apiURL = "https://api.line.me/v2/bot/profile/"
        + userId

    const headers = {
        Authorization: 'Bearer ' + serviceConfig.settings.accessToken
    }

    request({ uri: apiURL, headers: headers }, function (error, response, body) {

        const resultObj = {};

        const jsonBody = JSON.parse(body);

        if (!jsonBody) {
            return cb(resultObj);
        }

        if (jsonBody.displayName) {

            resultObj.name = jsonBody.displayName;

        }

        if (jsonBody.pictureUrl) {
            resultObj.avatarURL = jsonBody.pictureUrl;
        }

        return cb(resultObj);

    });

};



module["exports"] = new LineAdapter();

var _ = require('lodash');
var express = require('express');
var request = require('request');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var KikAdapter = function () {
}

KikAdapter.prototype.init = function (app) {
}

KikAdapter.prototype.setupWebHook = function (settings, webhookURL, cb) {

    const request_options = {
        url: "https://api.kik.com/v1/config",
        auth: {
            user: settings.botName,
            pass: settings.apiKey
        },
        json: {
            "webhook": webhookURL,
            "features": {
                "receiveReadReceipts": false,
                "receiveIsTyping": false,
                "manuallySendReadReceipts": false,
                "receiveDeliveryReceipts": false
            }
        }
    };

    // POST request to create webhook config
    request.post(request_options, (error, response, body) => {

        if (body.error)
            cb(JSON.stringify(body, null, "\t"), null);
        else
            cb(null, "OK");

    })

}

KikAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        res.sendStatus(403);

    }


    if (req.method == 'POST') {

        const data = req.body;


        // do parameter check
        if (!data.messages)
            return false;

        if (data.messages.length < 1)
            return false;

        if (!data.messages[0].chatId)
            return false;

        if (!config)
            return res.sendStatus(500);

        if (!config.settings)
            return res.sendStatus(500);

        data.messages.forEach((message) => {

            if (message.type == 'text') {

                processMessage(
                    config,
                    {
                        connectorIdentifier: "kik",
                        userIdentifier: message.from + "::" + message.chatId,
                        messageType: Const.messageTypeText,
                        text: message.body,
                        originalData: data
                    });

            } else {

                processMessage(
                    config,
                    {
                        connectorIdentifier: "kik",
                        userIdentifier: message.from + "::" + message.chatId,
                        messageType: Const.messageTypeText,
                        text: "Unsupported message : " + message.type,
                        originalData: data
                    });

            }

        });

        res.send("OK");

    }

}

KikAdapter.prototype.sendMessage = function (settings, message) {

    const room = message.room.toObject();

    return new Promise((res, rej) => {

        if (!room.external) return rej('invalid params');
        if (!settings.settings || !settings.settings.apiKey) return res(null);
        if (!settings.settings || !settings.settings.botName) return res(null);
        if (message.type != Const.messageTypeText) return res(null);

        const userIdentifierChunks = room.external.userIdentifier.split('::');
        if (userIdentifierChunks.length < 2)
            return res(null);

        const targetUserId = userIdentifierChunks[0];
        const chatId = userIdentifierChunks[1];

        var request_options = {
            url: "https://api.kik.com/v1/message",
            auth: {
                user: settings.settings.botName,
                pass: settings.settings.apiKey
            },
            json: {
                "messages": [
                    {
                        "body": message.message,
                        "to": targetUserId,
                        "type": "text",
                        "chatId": chatId
                    }
                ]
            }
        };

        // POST request to create webhook config
        request.post(request_options, (error, response, body) => {

            if (body.error) {
                console.log('Kik failed to send message', error);
                rej(body);
                return;
            }

            res({
                code: response.statusCode,
                body: body
            });

        });

    });

}

KikAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {

    if (!serviceConfig ||
        !serviceConfig.settings ||
        !messageData ||
        !messageData.messages ||
        messageData.messages.length == 0 ||
        !messageData.messages[0].from)
        return cb(null);

    const userId = messageData.messages[0].from;

    const request_options = {
        url: "https://api.kik.com/v1/user/" + userId,
        auth: {
            user: serviceConfig.settings.botName,
            pass: serviceConfig.settings.apiKey
        }
    };

    request(request_options, function (error, response, body) {

        const resultObj = {};

        const jsonBody = JSON.parse(body);

        if (!jsonBody) {
            return cb(resultObj);
        }

        if (jsonBody.firstName &&
            jsonBody.lastName) {

            resultObj.name = jsonBody.firstName + " " + jsonBody.lastName;

        }

        if (jsonBody.profilePicUrl) {
            resultObj.avatarURL = jsonBody.profilePicUrl;
        }

        return cb(resultObj);

    });


}

module["exports"] = new KikAdapter();

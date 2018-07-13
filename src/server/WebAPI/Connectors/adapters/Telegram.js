var _ = require('lodash');
var express = require('express');
var request = require('request');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var TelegramAdapter = function () {
}

TelegramAdapter.prototype.init = function (app) {
}

TelegramAdapter.prototype.setupWebHook = function (settings, webhookURL, cb) {

    const token = settings.accessToken

    var url = 'https://api.telegram.org/bot' + token + '/setWebhook';

    // request options
    var request_options = {
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        formData: {
            url: webhookURL
        }
    }

    // POST request to create webhook config
    request.post(request_options, (error, response, body) => {

        bodyJSON = JSON.parse(body);

        if (!bodyJSON.ok) {

            let errorMessage = JSON.stringify(bodyJSON, null, "\t");

            if (bodyJSON.error_code && bodyJSON.error_code == 404) {
                errorMessage += "\n Probably your access token is wrong";
            }

            cb(errorMessage, null);

        }

        else
            cb(null, "OK");

    })

}

TelegramAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        res.sendStatus(403);

    }

    if (req.method == 'POST') {

        const data = req.body;

        // do parameter check
        if (!data.update_id)
            return false;

        if (!data.message)
            return false;

        if (!data.message.message_id)
            return false;

        if (!config)
            return res.sendStatus(500);

        if (!config.settings)
            return res.sendStatus(500);

        if (data.message.text) {

            processMessage(
                config,
                {
                    connectorIdentifier: "telegram",
                    userIdentifier: data.message.from.id,
                    messageType: Const.messageTypeText,
                    text: data.message.text,
                    originalData: data
                });

        } else {

            processMessage(
                config,
                {
                    connectorIdentifier: "telegram",
                    userIdentifier: data.message.from.id,
                    messageType: Const.messageTypeText,
                    text: "Unsupported Message",
                    originalData: data
                });

        }

        res.send("OK");

    }

}

TelegramAdapter.prototype.sendMessage = function (settings, message) {

    const room = message.room.toObject();

    return new Promise((res, rej) => {

        if (!room.external) return rej('invalid params');
        if (!settings.settings || !settings.settings.accessToken) return res(null);
        if (message.type != Const.messageTypeText) return res(null);

        const url = 'https://api.telegram.org/bot' + settings.settings.accessToken + '/sendMessage';

        const targetUserId = room.external.userIdentifier;

        const request_options = {
            url: url,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
                chat_id: targetUserId,
                text: message.message
            }
        }

        // POST request to create webhook config
        request.post(request_options, function (error, response, body) {

            if (error) {
                console.log('Telegram failed to send message', error);
                rej(error);
                return;
            }

            const bodyJSON = JSON.parse(body);

            if (!bodyJSON.ok)
                return rej(bodyJSON);

            res(body);

        });


    });

}

TelegramAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {

    if (!serviceConfig ||
        !serviceConfig.settings ||
        !serviceConfig.settings.accessToken ||
        !messageData.message ||
        !messageData.message.from ||
        !messageData.message.from.id)
        return cb(null);

    const url = 'https://api.telegram.org/bot' + serviceConfig.settings.accessToken + '/getUserProfilePhotos';

    const request_options = {
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        formData: {
            user_id: messageData.message.from.id,
        }
    }


    request(request_options, function (error, response, body) {

        const resultObj = {};

        const jsonBody = JSON.parse(body);

        if (!jsonBody) {
            return cb(resultObj);
        }

        if (messageData.message.from.first_name &&
            messageData.message.from.last_name) {

            resultObj.name = messageData.message.from.first_name + " " + messageData.message.from.last_name;

        }

        if (jsonBody.result.photos && jsonBody.result.photos.length > 0) {
            const photoAry = jsonBody.result.photos[jsonBody.result.photos.length - 1];
            const fileId = photoAry[photoAry.length - 1].file_id;
            const filePathUrl = 'https://api.telegram.org/bot' + serviceConfig.settings.accessToken + '/getFile';

            const request_options = {
                url: filePathUrl,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                formData: {
                    file_id: fileId,
                }
            }

            request(request_options, (error, response, body) => {

                if (!body)

                    return cb(null);

                const jsonBody = JSON.parse(body);

                if (!jsonBody ||
                    !jsonBody.result ||
                    !jsonBody.result.file_path)

                    return cb(null);

                const fileUrl = 'https://api.telegram.org/file/bot' + serviceConfig.settings.accessToken + "/" + jsonBody.result.file_path;
                resultObj.avatarURL = fileUrl;
                return cb(resultObj);

            });

        }

    });


}

module["exports"] = new TelegramAdapter();

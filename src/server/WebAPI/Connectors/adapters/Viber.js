var _ = require('lodash');
var express = require('express');
var request = require('request');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var UserModel = require(pathTop + "Models/User");

var ViberAdapter = function () {
}

ViberAdapter.prototype.init = function (app) {
}

ViberAdapter.prototype.setupWebHook = function (apiKey, webhookURL, cb) {

    // request options
    const request_options = {
        url: "https://chatapi.viber.com/pa/set_webhook",
        headers: {
            "X-Viber-Auth-Token": apiKey
        },
        json: {
            "url": webhookURL,
            "event_types": [
                "delivered", "seen", "failed", "subscribed", "unsubscribed", "conversation_started"
            ]
        }
    };

    // POST request to create webhook config
    request.post(request_options, (error, response, body) => {

        if (body.status_message != 'ok')
            cb(JSON.stringify(body, null, "\t"), null);
        else
            cb(null, "OK");

    });

}

ViberAdapter.prototype.process = function (req, res, config, processMessage) {

    console.log(req.method, req.body, req.query);


    if (req.method == 'GET') {

        res.sendStatus(403);

    }


    if (req.method == 'POST') {

        var data = req.body;

        // do parameter check
        if (!data.event)
            return res.sendStatus(403);;

        if (data.event == 'webhook') {
            res.send("OK");
            return true;
        }

        if (!config)
            return res.sendStatus(500);

        if (!config.settings)
            return res.sendStatus(500);

        else if (data.event == 'message') {

            if (!data.message_token)
                return false;

            if (!data.sender)
                return false;

            if (!data.sender.id)
                return false;


            if (data.message.type == 'text') {

                processMessage(
                    config,
                    {
                        connectorIdentifier: "viber",
                        userIdentifier: data.sender.id,
                        messageType: Const.messageTypeText,
                        text: data.message.text,
                        originalData: data
                    });

            } else {

                processMessage(
                    config,
                    {
                        connectorIdentifier: "viber",
                        userIdentifier: data.sender.id,
                        messageType: Const.messageTypeText,
                        text: "Unsupported Message " + data.message.type,
                        originalData: data
                    });

            }

            res.send("OK");

            return true;

        } else
            res.sendStatus(403);

    }


}

ViberAdapter.prototype.sendMessage = function (settings, message) {

    // get agent
    const room = message.room.toObject();
    const userModel = UserModel.get();

    return new Promise((res, rej) => {

        userModel.findOne({
            _id: room.owner
        }, (err, result) => {

            if (err)
                return rej(err);

            res(result.toObject());

        });

    }).then((user) => {

        return new Promise((res, rej) => {

            if (!room.external) return rej('invalid params');
            if (!settings.settings || !settings.settings.apiKey) return res(null);
            if (message.type != Const.messageTypeText) return res(null);

            const targetUserId = room.external.userIdentifier;

            let avatarURL = "";
            if (user.avatar && user.avatar.thumbnail && user.avatar.thumbnail.nameOnServer)
                avatarURL = Config.serviceURL + "/api/v2/avatar/user/" + user.avatar.thumbnail.nameOnServer;

            var request_options = {
                url: "https://chatapi.viber.com/pa/send_message",
                headers: {
                    "X-Viber-Auth-Token": settings.settings.apiKey
                },
                json: {
                    "receiver": targetUserId,
                    "min_api_version": 1,
                    "sender": {
                        "name": user.name,
                        "avatar": avatarURL
                    },
                    "tracking_data": "tracking data",
                    "type": "text",
                    "text": message.message
                }
            };

            // POST request to create webhook config
            request.post(request_options, function (error, response, body) {

                if (error) {
                    console.log('Viber failed to send message', error);
                    rej(error);
                    return;
                }

                console.log('viber response', body);

                if (body.status_message != "ok")
                    return rej(body);

                res(body);

            });

        });

    });

}

ViberAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {

    if (!messageData ||
        !messageData.sender)
        return cb(null);

    resultObj = {};

    if (messageData.sender.name) {
        resultObj.name = messageData.sender.name;
    }

    if (messageData.sender.avatar) {
        resultObj.avatarURL = messageData.sender.avatar;
    }

    return cb(resultObj);

}

module["exports"] = new ViberAdapter();

var _ = require('lodash');
var express = require('express');
var request = require('request');
const util = require('util');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var FacebookAdapter = function () {
}

FacebookAdapter.prototype.init = function (app) {
}

FacebookAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        if (!req.query['hub.verify_token'])
            return res.sendStatus(422);

        if (req.query['hub.verify_token'] != config.settings.verifyToken) {
            return res.sendStatus(403);
        }

        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === config.settings.verifyToken) {

            res.status(200).send(req.query['hub.challenge']);

        } else {
            res.sendStatus(403);
        }

    }


    if (req.method == 'POST') {

        var data = req.body;

        // reply webhook which is for this service
        if (!data.entry)
            return res.sendStatus(422);

        if (data.entry.length == 0)
            return res.sendStatus(422);

        if (!data.entry[0].id)
            return res.sendStatus(422);

        if (!config)
            return res.sendStatus(500);

        if (!config.settings)
            return res.sendStatus(500);

        // send response immediatelly so prevent re-sending
        res.sendStatus(200);

        // check it is request from facebook
        // Make sure this is a page subscription
        if (data.object !== 'page')
            return;

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach((entry) => {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            if (!entry.messaging)
                return


            // Iterate over each messaging event
            entry.messaging.forEach((event) => {

                // ignore if message is from bot
                if (event.is_echo && config.replyToBot == false)
                    return;

                if (!event.message)
                    return;


                if (!event.message.text) {

                    processMessage(
                        config,
                        {
                            connectorIdentifier: "facebook",
                            userIdentifier: event.sender.id,
                            messageType: Const.messageTypeText,
                            ttext: "Unsupported message:" + event.message.type,
                            originalData: data
                        });


                    return;

                }


                processMessage(
                    config,
                    {
                        connectorIdentifier: "facebook",
                        userIdentifier: event.sender.id,
                        messageType: Const.messageTypeText,
                        text: event.message.text,
                        originalData: data
                    });

            });

        });

    }

}

FacebookAdapter.prototype.sendMessage = function (settings, message) {

    return new Promise((res, rej) => {

        const room = message.room.toObject();

        if (!room.external) return rej('invalid params');
        if (!settings.settings || !settings.settings.accessToken) return res(null);
        if (message.type != Const.messageTypeText) return res(null);

        const targetUserId = room.external.userIdentifier;

        var messageData = {
            recipient: {
                id: targetUserId
            },
            message: {
                text: message.message
            }
        };

        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: settings.settings.accessToken },
            method: 'POST',
            json: messageData

        }, (error, response, body) => {

            if (error) {
                console.log('Facebook failed to send message', error);
                rej(error);
                return;
            }

            if (!body.message_id)
                return rej(body);

            res(body);

        });

    });

}

FacebookAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {

    if (!messageData ||
        !messageData.entry ||
        messageData.entry.length == 0 ||
        !messageData.entry[0].messaging ||
        messageData.entry[0].messaging.length == 0 ||
        !messageData.entry[0].messaging[0].sender)
        return cb(null);

    const apiURL = "https://graph.facebook.com/v2.11/"
        + messageData.entry[0].messaging[0].sender.id
        + "?redirect=false"
        + "&access_token=" + serviceConfig.settings.accessToken;

    request(apiURL, function (error, response, body) {

        const resultObj = {};

        const jsonBody = JSON.parse(body);

        if (!jsonBody) {
            return cb(resultObj);
        }

        if (jsonBody.first_name &&
            jsonBody.last_name) {

            resultObj.name = jsonBody.first_name + " " + jsonBody.last_name;

        }

        if (jsonBody.profile_pic) {
            resultObj.avatarURL = jsonBody.profile_pic;
        }

        return cb(resultObj);

    });


}

module["exports"] = new FacebookAdapter();

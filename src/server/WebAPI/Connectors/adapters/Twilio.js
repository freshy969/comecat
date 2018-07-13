var _ = require('lodash');
var express = require('express');
var request = require('request');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var TwilioAdapter = function () {
}

TwilioAdapter.prototype.init = function (app) {
}

TwilioAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        res.sendStatus(403);

    }


    if (req.method == 'POST') {

        var data = req.body;

        // do parameter check
        if (!data.To)
            res.sendStatus(403);

        if (!data.From)
            res.sendStatus(403);

        if (data.To != config.settings.telephoneNumber)
            res.sendStatus(403);

        if (data.Body && data.Body.length > 0) {

            processMessage(
                config,
                {
                    connectorIdentifier: "twilio",
                    userIdentifier: data.From,
                    messageType: Const.messageTypeText,
                    text: data.Body
                });

        } else {
            res.sendStatus(403);
        }

    }

}

TwilioAdapter.prototype.sendMessage = function (settings, message) {

    const room = message.room.toObject();

    return new Promise((res, rej) => {

        if (!room.external) return rej('invalid params');
        if (!settings.settings || !settings.settings.telephoneNumber) return res(null);
        if (!settings.settings || !settings.settings.sid) return res(null);
        if (!settings.settings || !settings.settings.authToken) return res(null);
        if (message.type != Const.messageTypeText) return res(null);

        const targetUserId = room.external.userIdentifier;

        // Twilio Credentials 
        var accountSid = settings.settings.sid;
        var authToken = settings.settings.authToken;
        var telephoneNumber = settings.settings.telephoneNumber;

        //require the Twilio module and create a REST client 
        var client = require('twilio')(accountSid, authToken);

        client.messages.create({
            to: targetUserId,
            from: telephoneNumber,
            body: message.message,
        }, (err, message) => {

            if (err) {
                console.log('Twilio failed to send message', err);
                rej(err);
                return;
            }

            res(message);

        });


    });

}

TwilioAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {
    return cb(null);
}

module["exports"] = new TwilioAdapter();

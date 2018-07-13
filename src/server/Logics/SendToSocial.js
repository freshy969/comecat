/**  Returns total unread message count */

var _ = require('lodash');
var async = require('async');
var apn = require('apn');
var gcm = require('node-gcm');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require("../lib/utils");

var ConnectorModel = require('../Models/Connector');

var FacebookAdapter = require('../WebAPI/Connectors/adapters/Facebook');
var LinebookAdapter = require('../WebAPI/Connectors/adapters/Line');
var ViberAdapter = require('../WebAPI/Connectors/adapters/Viber');
var KikAdapter = require('../WebAPI/Connectors/adapters/Kik');
var TelegramAdapter = require('../WebAPI/Connectors/adapters/Telegram');
var TwilioAdapter = require('../WebAPI/Connectors/adapters/Twilio');
var WechatAdapter = require('../WebAPI/Connectors/adapters/Wechat');

var SendToSocial = {

    send: function (room, messageObj, originalRequestData) {

        if (!room.external)
            return;

        const connectorModel = ConnectorModel.get();
        const socialSettingsId = room.external.serviceSettingId;

        let socialSettings = null;

        new Promise((res, rej) => {

            // get social settings
            connectorModel.findOne({
                _id: socialSettingsId,
                status: { $ne: Const.integrationStateDisabled }
            }, (err, findResult) => {

                if (err || !findResult) {
                    return;
                    // do nothing
                }

                socialSettings = findResult;

                res({
                    socialSettings: findResult
                });
            });

        }).then((result) => {

            if (result.socialSettings.connectorIdentifier == 'facebook') {

                return FacebookAdapter.sendMessage(result.socialSettings, messageObj);

            }

            else if (result.socialSettings.connectorIdentifier == 'line') {

                return LinebookAdapter.sendMessage(result.socialSettings, messageObj);

            }


            else if (result.socialSettings.connectorIdentifier == 'viber') {

                return ViberAdapter.sendMessage(result.socialSettings, messageObj);

            }

            else if (result.socialSettings.connectorIdentifier == 'kik') {

                return KikAdapter.sendMessage(result.socialSettings, messageObj);

            }

            else if (result.socialSettings.connectorIdentifier == 'telegram') {

                return TelegramAdapter.sendMessage(result.socialSettings, messageObj);

            }

            else if (result.socialSettings.connectorIdentifier == 'twilio') {

                return TwilioAdapter.sendMessage(result.socialSettings, messageObj);

            }

            else if (result.socialSettings.connectorIdentifier == 'wechat') {

                return WechatAdapter.sendMessage(result.socialSettings, messageObj);

            }


        }).then((result) => {

            if (socialSettings.status == Const.integrationStateEnabled)
                return;

            console.log("social settings enabled");

            connectorModel.update
                ({
                    _id: socialSettingsId
                }, {
                    status: Const.integrationStateEnabled,
                    error: ""
                }, (err, findResult) => {

                });

        }).catch((err) => {

            console.log("social settings disabled");

            connectorModel.update
                ({
                    _id: socialSettingsId
                }, {
                    status: Const.integrationStateDisabled,
                    error: JSON.stringify(err, null, "\t")
                }, (err, findResult) => {



                });

        });

    }

};


module["exports"] = SendToSocial;
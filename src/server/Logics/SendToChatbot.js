/**  Returns total unread message count */

var _ = require('lodash');
var async = require('async');
var apn = require('apn');
var gcm = require('node-gcm');
var request = require('request');
var WatsonConversationV1 = require('watson-developer-cloud/conversation/v1');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require("../lib/utils");

var ChatbotSettingsModel = require('../Models/ChatbotSettings');
var Connector = require('../Models/Connector');
var UserModel = require('../Models/User');

var FacebookAdapter = require('../WebAPI/Connectors/adapters/Facebook');

var SendToChatbot = {

    send: function (room, messageObj) {

        if (!room.external)
            return;

        if (!room.external.connectorIdentifier)
            return;

        if (!room.bot)
            return;

        if (room.bot.botEnabled == 0)
            return;

        const connectorIdentifier = room.external.connectorIdentifier;

        const chatbotSettingsModel = ChatbotSettingsModel.get();
        const connectorModel = Connector.get();

        const agentUserId = room.users.filter((userId) => {

            return userId != messageObj.user._id;

        });

        if (!agentUserId || agentUserId.length == 0) {
            return Promise.resolve();
        }

        new Promise((res, rej) => {

            connectorModel.findOne({
                userId: agentUserId[0],
                connectorIdentifier: connectorIdentifier
            }, (err, findResult) => {

                if (err) return rej(err);

                res(findResult);

            });

        }).then((connector) => {

            console.log('connector', connector);

            if (connector.botId && connector.botId.length > 0) {

                chatbotSettingsModel.findOne({
                    _id: connector.botId,
                    status: { $ne: Const.integrationStateDisabled }
                }, (err, findResult) => {

                    if (!findResult) {
                        console.log('no chatbot found', connector.botId)
                        return;
                    }

                    if (findResult.chatbotIdentifier == 'dialogflow') {
                        this.processDialogFlow(findResult, room, messageObj);
                    }

                    else if (findResult.chatbotIdentifier == 'watson') {
                        this.processWatson(findResult, room, messageObj);
                    }

                });

            } else {

            }

        }).catch((err) => {
            console.error(err);
        });

    },

    processDialogFlow: function (chatbotSettings, room, message) {

        if (!chatbotSettings.settings) {
            return;
        }

        const chatbotSettingsModel = ChatbotSettingsModel.get();
        const accessToken = chatbotSettings.settings.accessToken;

        if (!accessToken)
            return;

        if (message.type != Const.messageTypeText)
            return;

        const messageText = message.message;


        request.post({
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            uri: "https://api.dialogflow.com/v1/query?v=20150910",
            body: {
                lang: "en",
                query: messageText,
                sessionId: room._id,
            },
            json: true,
            method: 'POST'
        }, (err, res, body) => {

            if (body && body.result && body.result.fulfillment && body.result.fulfillment.speech) {

                this.processBotMessage(room, body.result.fulfillment.speech)

                if (chatbotSettings.status != Const.integrationStateDisabled) {

                    chatbotSettingsModel.update
                        ({
                            _id: chatbotSettings._id
                        }, {
                            status: Const.integrationStateEnabled,
                            error: JSON.stringify(body, null, "\t")
                        }, (err, findResult) => {



                        });

                }
            } else {

                chatbotSettingsModel.update
                    ({
                        _id: chatbotSettings._id
                    }, {
                        status: Const.integrationStateDisabled,
                        error: JSON.stringify(body, null, "\t")
                    }, (err, findResult) => {



                    });


                console.log(err, body);

            }

        });


    },

    processWatson: function (chatbotSettings, room, message) {

        if (message.type != Const.messageTypeText)
            return;

        if (!chatbotSettings.settings) {
            return;
        }

        const chatbotSettingsModel = ChatbotSettingsModel.get();

        const username = chatbotSettings.settings.username;
        const password = chatbotSettings.settings.pass;
        const workspaceID = chatbotSettings.settings.workspaceID;

        if (!username || username.length == 0)
            return;

        if (!password || password.length == 0)
            return;

        if (!workspaceID || workspaceID.length == 0)
            return;

        if (message.type != Const.messageTypeText)
            return;

        const messageText = message.message;

        // Set up Conversation service wrapper.
        var conversation = new WatsonConversationV1({
            username: username, // replace with service username
            password: password, // replace with service password
            version_date: '2017-05-26'
        });

        var workspace_id = workspaceID; // replace with workspace ID

        // Start conversation with empty message.
        conversation.message({
            workspace_id: workspace_id,
            input: { text: messageText },
            context: {
                conversation_id: room._id
            }
        }, (err, response) => {
            if (err) {
                console.error(err); // something went wrong

                chatbotSettingsModel.update
                    ({
                        _id: chatbotSettings._id
                    }, {
                        status: Const.integrationStateDisabled,
                        error: JSON.stringify(err, null, "\t")
                    }, (err, findResult) => {



                    });


                return;
            }

            // Display the output from dialog, if any.
            if (response.output.text.length != 0) {
                const responseMessage = response.output.text[0];
                this.processBotMessage(room, responseMessage);


                if (chatbotSettings.status != Const.integrationStateDisabled) {

                    chatbotSettingsModel.update
                        ({
                            _id: chatbotSettings._id
                        }, {
                            status: Const.integrationStateEnabled,
                            error: ""
                        }, (err, findResult) => {



                        });

                }

            } else {

                chatbotSettingsModel.update
                    ({
                        _id: chatbotSettings._id
                    }, {
                        status: Const.integrationStateDisabled,
                        error: JSON.stringify(body, null, "\t")
                    }, (err, findResult) => {



                    });


            }
        });


    },

    processBotMessage: function (room, message) {

        var SendMessageLogic = require("./SendMessage");
        const botUserId = Config.robotUserId;

        if (!botUserId)
            return;

        userModel = UserModel.get();

        async.waterfall(
            [(done) => {

                const result = {};

                // find bot user
                userModel.findOne({
                    _id: botUserId
                }, (err, findResult) => {

                    result.user = findResult;

                    done(null, result);

                });

            },
            (result, done) => {

                if (!result.user) {
                    console.log('no bot user');
                    return;
                }

                setTimeout(() => {

                    // send message to room
                    const params = {
                        userID: result.user._id,
                        roomID: Const.chatTypeRoom + "-" + room._id,
                        message: message,
                        localID: Utils.getRandomString(),
                        plainTextMessage: true,
                        type: Const.messageTypeText
                    };

                    SendMessageLogic.send(params, (err) => {

                        done(err, result);

                    }, (message) => {

                        result.message = message;

                        done(null, result);

                    });

                }, 100);

            }
            ],
            (err, result) => {

                console.log(err);

            });

    }

};


module["exports"] = SendToChatbot;
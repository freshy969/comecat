var _ = require('lodash');
var express = require('express');
var request = require('request');
var wechat = require('wechat');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var ConnectorModel = require(pathTop + 'Models/Connector');

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var WechatAdapter = function () {
}

WechatAdapter.prototype.init = function (app) {
}

WechatAdapter.prototype.process = function (req, res, config, processMessage) {

    if (!config)
        return res.sendStatus(500);

    if (!config.settings)
        return res.sendStatus(500);

    if (!config.settings.apiToken)
        return res.sendStatus(500);

    wechat(config.settings.apiToken, (req, res, next) => {

        // message is located in req.weixin
        var message = req.weixin;

        // send empty text immediatelly to respond in 5 sec
        res.reply('');

        if (!message)
            return;

        // save fromUserName
        if (!config.settings.fromUsername || config.settings.fromUsername.length == 0) {

            const connectorModel = ConnectorModel.get();

            connectorModel.update
                ({
                    _id: config._id
                }, {
                    "settings.fromUsername": message.FromUserName
                }, (err, updateResult) => {

                    console.log(updateResult);

                });

        }

        if (message.MsgType == 'text' &&
            message.Content && message.Content.length > 0) {

            processMessage(
                config,
                {
                    connectorIdentifier: "wechat",
                    userIdentifier: message.FromUserName,
                    messageType: Const.messageTypeText,
                    text: message.Content,
                    originalData: message
                });

        } else {

            processMessage(
                config,
                {
                    connectorIdentifier: "wechat",
                    userIdentifier: message.FromUserName,
                    messageType: Const.messageTypeText,
                    text: "Unsupported Message",
                    originalData: message
                });

        }

        console.log(message);

        /*
                {
                    ToUserName: 'gh_65db37b5a4e3',
                        FromUserName: 'ovf740Q_TZUWlxxf2bAzKRLHq-1k',
                            CreateTime: '1522065904',
                                MsgType: 'text',
                                    Content: 'Hi',
                                        MsgId: '6537223280473504483'
                }
        */
        /*
        
                if (message.FromUserName === 'diaosi') {
                    // reply with text
                    res.reply('hehe');
                } else if (message.FromUserName === 'text') {
                    // another way to reply with text
                    res.reply({
                        content: 'text object',
                        type: 'text'
                    });
                } else if (message.FromUserName === 'hehe') {
                    // reply with music
                    res.reply({
                        type: "music",
                        content: {
                            title: "Just some music",
                            description: "I have nothing to lose",
                            musicUrl: "http://mp3.com/xx.mp3",
                            hqMusicUrl: "http://mp3.com/xx.mp3"
                        }
                    });
                } else {
                    // reply with thumbnails posts
                    res.reply([
                        {
                            title: 'Come to fetch me',
                            description: 'or you want to play in another way ?',
                            picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                            url: 'http://nodeapi.cloudfoundry.com/'
                        }
                    ]);
                }
        
                */
    })(req, res);


}

WechatAdapter.prototype.sendMessage = function (settings, message) {

    let retryCount = 0;

    const sendMessage = (accessToken, to, message) => {

        return new Promise((res, rej) => {

            var request_options = {
                url: "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + accessToken,
                json: {
                    "touser": to,
                    "msgtype": "text",
                    "text":
                        {
                            "content": message
                        }
                }
            };

            // POST request to create webhook config
            request.post(request_options, function (error, response, body) {

                if (body.errcode == 40001) {

                    res(body);

                }
                else if (body.errcode != 0) {
                    console.log('Wechat failed to send message', error);
                    rej(body);
                    return;
                }

                res(body);

            });

        }).then((body) => {

            if (body.errcode == 40001) {

                if (retryCount < 1) {

                    retryCount++;

                    return this.getAccessToken().then((newAccessToken) => {

                        return sendMessage(newAccessToken, to, message);

                    });

                } else {

                    return Promise.reject(body);

                }

            } else if (body.errcode === 0) {

                return Promise.resolve(body);

            } else {

            }

        });

    }

    const room = message.room.toObject();

    if (!room.external) return rej('invalid params');
    if (!settings.settings || !settings.settings.appId) return res(null);
    if (!settings.settings || !settings.settings.appSecret) return res(null);
    if (message.type != Const.messageTypeText) return res(null);

    const targetUserId = room.external.userIdentifier;

    return new Promise((res, rej) => {

        res(settings.settings.accessToken);

    }).then((savedAccessToken) => {

        if (!savedAccessToken) {
            return getAccessToken();
        } else {
            return Promise.resolve(savedAccessToken);
        }

    }).then((accessToken) => {

        if (!accessToken)
            return Promise.reject('failed to obtain access token');

        return sendMessage(accessToken, targetUserId, message.message);

    });

}

WechatAdapter.prototype.getUserData = function (serviceConfig, messageData, cb) {


    if (!serviceConfig ||
        !serviceConfig.settings ||
        !serviceConfig.settings.apiToken ||
        !messageData ||
        !messageData.FromUserName)
        return cb(null);

    let retry = 0;

    const getUserProfile = (accessToken, userId) => {

        var request_options = {
            url: "https://api.weixin.qq.com/cgi-bin/user/info?openid=" + userId + "&lang=en_US&access_token=" + accessToken,
        };

        request.get(request_options, (error, response, body) => {

            if (error || !body || body.length === 0)
                return cb(null);

            const resultObj = {};

            const jsonBody = JSON.parse(body);

            if (!jsonBody) {
                return cb(resultObj);
            }

            if (jsonBody.errcode == 40001) {
                retry++;

                if (retry < 2) {
                    return this.getAccessToken(serviceConfig).then((accessToken) => {
                        getUserProfile(accessToken, messageData.FromUserName);
                    });
                }
            }

            if (jsonBody.nickname) {

                resultObj.name = jsonBody.nickname;

            }

            if (jsonBody.headimgurl) {
                resultObj.avatarURL = jsonBody.headimgurl;
            }

            return cb(resultObj);

        });

    }

    if (serviceConfig.settings.accessToken) {

        getUserProfile(serviceConfig.settings.accessToken, messageData.FromUserName);

    } else {

        this.getAccessToken(serviceConfig).then((accessToken) => {

            getUserProfile(accessToken, messageData.FromUserName);

        });

    }

}

WechatAdapter.prototype.getAccessToken = function (settings) {

    return new Promise((res, rej) => {

        if (!settings.settings || !settings.settings.appId) return res(null);
        if (!settings.settings || !settings.settings.appSecret) return res(null);

        // obtain access token
        const url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + settings.settings.appId + "&secret=" + settings.settings.appSecret;

        var request_options = {
            url: url,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        };

        // POST request to create webhook config
        request(url, function (error, response, body) {

            const jsonBody = JSON.parse(body);

            if (jsonBody.errmsg || !jsonBody['access_token']) {
                console.log('Wechat failed to get acccess token', error);
                rej(body);
                return;
            }

            res(jsonBody['access_token']);

        });

    }).then((accessToken) => {

        const connectorModel = ConnectorModel.get();

        return new Promise((res, rej) => {

            connectorModel.update
                ({
                    _id: settings._id
                }, {
                    "settings.accessToken": accessToken
                }, (err, findResult) => {

                    if (err) {
                        return rej(err);
                    }

                    res(accessToken);

                });

        });

    });

}

module["exports"] = new WechatAdapter();

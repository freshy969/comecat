import * as init from './config.js';
import * as utils from './Utils.js';
import * as actionTypes from '../constants/ActionTypes';
//import * as utils from './Utils';
import io from 'socket.io-client';

import { globalStore } from '../../index';
import * as crypt from './CryptManager';
import * as actions from '../actions/index';

let instance = null;

class SpikaConnector {

    constructor(baseURL, apiKey) {

        if (!instance) {
            instance = this;

            this.baseURL = baseURL;
            this.apiKey = apiKey;
            this.accessToken = null;
            this.accessTokenBot = null;
            this.room = null;
            this.currentGuest = null;
            this.currentAgent = null;
            this.currentBot = null;
            this.initialMessagePosted = false;

        }

        return instance;
    }

    getInstance() {
        return instance;
    }

    config(baseURL, apiKey) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
        this.accessToken = "";

        globalStore.actionListers.push(this);
    }

    listenActions(action) {
        if (action.type == actionTypes.SENDTEXT) {
            this.processSendText(action.text).then(() => {
                console.log('sent to spika');
            }).catch((error) => {
                console.log('failed to sent to spika');
            });
        }

        if (action.type == actionTypes.OPENCHAT) {

            if (!this.initialMessagePosted) {
                this.initialMessagePosted = true;
                this.postInitialMessage();
            }

        }

        if (action.type == actionTypes.TYPE_TEXT) {

            if (action.text.length == 0) {

                this.socket.emit('sendtyping', {
                    roomID: '3-' + this.room.id,
                    type: 0,
                    userID: this.currentGuest.id,
                    userName: this.currentGuest.name
                });

            } else {

                this.socket.emit('sendtyping', {
                    roomID: '3-' + this.room.id,
                    type: 1,
                    userID: this.currentGuest.id,
                    userName: this.currentGuest.name
                });

            }

        }

    }

    getMessages(lastMessageId, direction) {

        if (!this.room)
            return null;

        return fetch(this.baseURL + '/message/list/3-' + this.room.id + "/" + lastMessageId + "/" + direction,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessToken
                }
            }).then((res) => {

                //result.status = res.status;

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => { res(response.messages) });

            })

    }

    signinAsGuest(organization, username, email) {

        return this.signinAfterCheckSession(organization, username, email)

            .then((signinResult) => {

                return new Promise((res, rej) => {

                    // login to Socket.Io

                    if (!this.socket) {
                        this.socket = io(init.SpikaWebSocketURL, {
                            transports: ['websocket'],
                            upgrade: false
                        });

                        this.setupSocketLietener();

                    } else {
                        this.socket = io(init.SpikaWebSocketURL, {
                            transports: ['websocket'],
                            upgrade: false
                        });
                    }

                    res(signinResult);

                });


            }).then(() => {

                if (!this.currentAgent)
                    return this.getAgent();
                else
                    return new Promise((res, rej) => { res(this.currentAgent) });

            }).then(({ agent }) => {

                this.currentAgent = agent;
                globalStore.dispatch(actions.spika.agentFetched(agent));

                // get/create room
                if (!this.room)
                    return this.getExisingRoom();
                else
                    return new Promise((res, rej) => { res(this.room) });

            }).then((room) => {

                if (!room) {
                    //if (username != init.DefaultUserName)
                    //    username = username + "(web)";

                    return this.createRoom(username, email);
                }

                else
                    return new Promise((res, rej) => { res(room) });
            }).then((room) => {

                this.room = room;
                return new Promise((res, rej) => { res(this.currentGuest) });
            })
    }

    signinAfterCheckSession(organization, username, email) {

        if (window.localStorage &&
            utils.getLocal("accessToken") &&
            utils.getLocal("userData")) {

            return fetch(this.baseURL + '/test/token/',
                {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        apikey: this.apiKey,
                        'access-token': utils.getLocal("accessToken")
                    }
                })
                .then((res) => {

                    if (res.status == 200) {
                        return res.json();
                    } else {
                        return res.text();
                    }

                }).then((response) => {

                    if (response == 'ok') {

                        const userData = JSON.parse(utils.getLocal("userData"));
                        this.accessToken = utils.getLocal("accessToken");
                        this.currentGuest = userData;

                        globalStore.dispatch(actions.spika.userFetched(userData));

                        return Promise.resolve();

                    } else {

                        utils.removeLocal("savedemail");
                        utils.removeLocal("savedname");
                        utils.removeLocal("accessToken");
                        utils.removeLocal("userData");

                        return Promise.reject("invalid token");

                    }

                });

        } else {

            return this.doSignin(organization, username, email);

        }

    }

    doSignin(organization, username, email) {

        let usernameOrig = username;
        let emailOrig = email;
        let loginUsername = null;
        let emailEscaped = null;

        if (!username) {
            username = init.DefaultUserName;
        }

        if (!email) {
            email = init.DefaultEmail;
            loginUsername = "guest" + window.connectorId + utils.now();
        } else {

            let emailEscaped = email.replace(/@/g, "").replace(/\./g, "");
            loginUsername = emailEscaped + window.connectorId;

        }

        if (window.localStorage && usernameOrig && utils.getLocal(loginUsername)) {
            loginUsername = utils.getLocal(loginUsername);
        }

        var postData = {
            organization: organization,
            username: loginUsername,
            displayname: username
        };

        return fetch(this.baseURL + '/signin/guest',
            {
                method: 'POST',
                body: JSON.stringify(postData),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    apikey: this.apiKey
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                if (window.localStorage && emailOrig) {
                    utils.saveLocal(loginUsername, response.user.userid);
                    utils.saveLocal("savedemail", emailOrig);
                    utils.saveLocal("savedname", usernameOrig);
                }

                return new Promise((res, rej) => {

                    if (response['access-token']) {

                        if (window.localStorage) {
                            utils.saveLocal("accessToken", response['access-token']);
                            utils.saveLocal("userData", JSON.stringify(response.user));
                        }

                        this.accessToken = response['access-token'];
                        this.currentGuest = response.user;
                        globalStore.dispatch(actions.spika.userFetched(response.user));
                        res();

                    } else
                        rej('Failed to login');

                });


            });
    }

    setupSocketLietener() {

        if (!this.socket)
            return;

        this.socket.on('connect', () => {

            this.socket.emit('login', {
                token: this.accessToken,
                processId: this.accessToken
            });

        });

        this.socket.on('newmessage', (obj) => {

            const message = obj.message;

            if (obj.type == 1) {

                if (!message || message.length == 0) {
                    console.log('message is empty');
                    return;
                }

                const decryptedMessage = crypt.decryptText(message);
                obj.message = decryptedMessage;

            }

            const userId = obj.userID;
            globalStore.dispatch(actions.chat.receiveMessage(obj));

        });

        this.socket.on('typing', (obj) => {

            const isTypeOn = obj.type;

            if (obj.userID == this.currentGuest.id)
                return;

            if (isTypeOn == 1) {
                // show typing
                globalStore.dispatch(actions.chat.showTyping(obj));

            } else {
                // hide typing
                globalStore.dispatch(actions.chat.hideTyping(obj));


            }

        });


    }


    postInitialMessage() {

        setTimeout(() => {
            this.postRobotMessage("Hi, I'm clover bot. I will help you until agent join to the chat. Can you let me know your email address first ?");
        }, 1500)
    }

    postRobotMessage(text) {

        if (!this.accessToken)
            return console.log('Not signed in');

        return new Promise((res, rej) => {

            return this.sendTextToSpikaAsBot(text);

        })
            .catch((err) => {

                console.log(err);

            });


        /*
        globalStore.dispatch(onReceiveText({
            id: utils.now(),
            message: "Hi, I'm clover bot. I will help you until agent join to the chat. Can you let me know your email address first ?"
        }));
        */

    }

    processSendText(text) {

        if (!this.accessToken)
            return console.log('Not signed in');

        return new Promise((res, rej) => {

            if (!this.currentAgent)
                this.getAgent().then(({ agent }) => {
                    res(agent);
                })
            else
                res(this.currentAgent);

        })
            .then((room) => {

                if (!room)
                    return this.createRoom();
                else
                    return new Promise((res, rej) => { res(this.room) });


            })
            .then((room) => {

                this.room = room;
                return this.sendTextToSpika(text);

            })
            .then((message) => {

                //globalStore.dispatch(onSendTextSuccess(message));

            })
            .catch((err) => {

                console.log(err);

            });

    }

    getExisingRoom() {

        return fetch(this.baseURL + '/rooms/guest/' + this.currentGuest.id,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessToken
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => {

                    res(response.room);

                });

            });

    }

    createRoom(name, description) {

        var FormData = require('form-data');
        var form = new FormData();
        form.append('name', name);
        form.append('description', description);
        form.append('ownerID', this.currentAgent.id);
        form.append('users', this.currentAgent.id + "," + this.currentGuest.id);
        form.append('defaultAvatarFile', this.currentGuest.avatar.picture.originalName);

        return fetch(this.baseURL + '/rooms',
            {
                method: 'POST',
                body: form,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessToken
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => {

                    if (response.room) {
                        res(response.room);
                    } else {
                        rej('faild to send message');
                    }

                });

            });

    }

    getAgent() {

        return fetch(this.baseURL + '/webconnector/' + window.connectorId,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessToken
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => {

                    if (response.user) {

                        globalStore.dispatch(actions.spika.agentFetched(response.user));

                        if (window.localStorage) {
                            utils.saveLocal("agentData", JSON.stringify(response.user));
                        }

                        res({
                            agent: response.user,
                            connectors: response.connectors,
                            webconnector: response.webconnector,
                        });

                    } else {
                        rej('No agent found');
                    }

                });

            });

    }

    sendTextToSpikaAsBot(text) {

        const postData = {
            targetType: 3,
            target: this.room.id,
            messageType: 1,
            message: text
        };

        return fetch(this.baseURL + '/messages',
            {
                method: 'POST',
                body: JSON.stringify(postData),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessTokenBot
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => {

                    if (response.message) {
                        res(response.message);
                    } else {
                        rej('faild to create room');
                    }

                });

            });

    }

    sendTextToSpika(text) {

        const postData = {
            targetType: 3,
            target: this.room.id,
            messageType: 1,
            type: 1,
            sending: true,
            localID: utils.getRandomString(),
            message: text,
            created: utils.now()
        };

        const localTempData = Object.assign({}, postData);
        localTempData.userID = this.currentGuest.id;
        localTempData._id = utils.getRandomString();

        globalStore.dispatch(actions.chat.sendMessageDataCreated(localTempData));

        return fetch(this.baseURL + '/messages',
            {
                method: 'POST',
                body: JSON.stringify(postData),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    apikey: this.apiKey,
                    'access-token': this.accessToken
                }
            })
            .then((res) => {

                if (res.status == 200) {
                    return res.json();
                } else {
                    return res.text();
                }

            }).then((response) => {

                return new Promise((res, rej) => {

                    if (response.message) {
                        res(response.message);
                    } else {
                        rej('faild to create room');
                    }

                });

            });

    }

    sendFile(file, progressCB) {

        const localID = utils.getRandomString();

        const tempData = {
            targetType: 3,
            target: this.room.id,
            messageType: 2,
            type: 2,
            sending: true,
            localID: localID,
            created: utils.now(),
            file: {
                file: file
            }
        };

        const localTempData = Object.assign({}, tempData);
        localTempData.userID = this.currentGuest.id;
        localTempData._id = utils.getRandomString();

        globalStore.dispatch(actions.chat.sendMessageDataCreated(localTempData));

        return new Promise((resolve, reject) => {

            const req = new XMLHttpRequest();

            req.open('POST', this.baseURL + '/files/upload')

            req.setRequestHeader('access-token', this.accessToken);
            req.setRequestHeader('apikey', this.apiKey, );

            req.upload.addEventListener('progress', function (e) {
                const progress = Math.floor(e.loaded / e.total * 100);
                if (progressCB)
                    progressCB(progress);
            })

            req.addEventListener('load', e => {
                if (e.target.status === 200) {
                    resolve(JSON.parse(e.target.responseText));
                }
                else {
                    //todo: handle error
                    reject(e.target.status);
                }
            });

            req.addEventListener('error', e => {
                //todo: handle error
                reject(e.target.status);
            })

            const data = new FormData();
            data.append('file', file);

            req.send(data);

        }).then((fileResponse) => {

            const fileObj = {
                id: fileResponse.file.fileId,
                size: fileResponse.file.size,
                name: file.name,
                mimeType: fileResponse.file.mimeType,
            };

            let thumb = null;

            if (fileResponse.thumbnail) {
                thumb = {
                    id: fileResponse.thumbnail.fileId,
                    size: fileResponse.thumbnail.size,
                    name: file.name,
                    mimeType: fileResponse.thumbnail.mimeType,
                }
            }

            const postData = {
                targetType: 3,
                target: this.room.id,
                messageType: 2,
                type: 2,
                sending: true,
                localID: localID,
                file: {
                    file: fileObj,
                    thumb: thumb
                },
                created: utils.now()
            };

            console.log('postData', postData);

            return fetch(this.baseURL + '/messages',
                {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        apikey: this.apiKey,
                        'access-token': this.accessToken
                    }
                });

        });

    }


}

export default new SpikaConnector();
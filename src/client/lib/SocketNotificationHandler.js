import Encryption from './encryption/encryption';
import { store } from '../index';
import user from './user';

import * as constant from './const';
import * as config from './config';
import notificationSound from '../assets/sounds/notification.mp3';
import * as utils from '../lib/utils';

import ServiceWorkerManager from './ServiceWorkerManager';

class SocketNotificationHandler {

    constructor() {
        this.visibility = null;
        this.wasInitialised = false;

        this.audioElement = new Audio(notificationSound);
    }

    init = () => {
        console.log('starting window notification manager');

        if (!this.wasInitialised) {
            this.initVisibilityEventListeners();

        }
        this.wasInitialised = true;

        return Promise.resolve('window notification manager successfuly initalised');
    }

    initVisibilityEventListeners = callback => {

        if (!('Notification' in window)) return;

        window.addEventListener('load', () => {

            let hidden, visibilityChange;

            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }

            this.setVisibility(!window.document[hidden]);

            window.document.addEventListener(visibilityChange, () => {
                this.setVisibility(!window.document[hidden]);
            });

            window.addEventListener("focus", () => this.setVisibility(true));
            window.addEventListener("blur", () => this.setVisibility(false));
        });

    }

    setVisibility = val => {
        this.visibility = val;

    }

    handleMessage = obj => {

        if (user.userData._id === obj.user._id) return;

        const chatType = utils.getChatTypeFromRoomId(obj.roomID);

        const title = `${obj.user.name} sent:`
        let message;
        let avatar = config.APIEndpoint;
        let singleChatId;

        switch (obj.type) {
            case constant.MessageTypeText:
                message = Encryption.decryptText(obj.message);
                break;
            case constant.MessageTypeSticker:
                message = 'Sticker';
                break;
            case constant.MessageTypeFile:
                message = 'File';
                break;
            default:
                message = 'message';
        }

        switch (chatType) {
            case constant.ChatTypePrivate:

                singleChatId = utils.getTargetUserIdFromRoomId(obj.roomID);

                avatar += constant.ApiUrlGetUserAvatar;
                if (obj.user.avatar && obj.user.avatar.thumbnail)
                    avatar += obj.user.avatar.thumbnail.nameOnServer;
                else avatar += obj.user._id;
                break;

            case constant.ChatTypeGroup:

                singleChatId = utils.getGroupOrRoomIdFromRoomID(obj.roomID);

                avatar += constant.ApiUrlGetGroupAvatar;
                if (obj.group.avatar && obj.group.avatar.thumbnail)
                    avatar += obj.group.avatar.thumbnail.nameOnServer;
                else avatar += obj.group._id;
                break;

            case constant.ChatTypeRoom:

                singleChatId = utils.getGroupOrRoomIdFromRoomID(obj.roomID);

                avatar += constant.ApiUrlGetRoomAvatar;
                if (obj.room.avatar && obj.room.avatar.thumbnail)
                    avatar += obj.room.avatar.thumbnail.nameOnServer;
                else avatar += obj.room._id;
                break;
        }

        const silent = store.getState().userData.muted.includes(singleChatId);

        if (!this.visibility) this.showNotification(title, message, avatar, silent);

    }


    showNotification = (title, body, icon, silent) => {

        if (!('Notification' in window)) return;

        const options = {
            body,
            icon
        };

        const notification = new Notification(title, options);

        if (!silent) this.audioElement.play();

        this.lastNotificationTimeout = setTimeout(
            () => notification.close(),
            constant.NotificationCloseTimeout);
    }

}

export default new SocketNotificationHandler();

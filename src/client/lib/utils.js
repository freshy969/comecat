import * as config from "./config";
import * as constant from "./const";
import user from "./user";

export function chatIdByUser(targetUser) {
    let chatId = "";
    let user1 = user.userData;
    let user2 = targetUser;

    if (user1.created < user2.created) {
        chatId = constant.ChatTypePrivate + "-" + user1._id + "-" + user2._id;
    } else {
        chatId = constant.ChatTypePrivate + "-" + user2._id + "-" + user1._id;
    }

    return chatId;
}

export function chatIdByGroup(group) {
    return constant.ChatTypeGroup + "-" + group._id;
}

export function chatIdByRoom(room) {
    return constant.ChatTypeRoom + "-" + room._id;
}

export function getChatIdFromUrl(url) {
    if (url) {
        const strippedURL = url.replace(config.BasePath, "").replace("/chat", "").replace("/", "");
        return strippedURL.split('-').length >= 2 ? strippedURL : "";
    }
    return url;
}

export function getTargetUserIdFromRoomId(roomId) {
    const chunks = roomId.split("-");

    if (chunks.length < 3) return null;

    const user1 = chunks[1];
    const user2 = chunks[2];

    if (user1 == user.userData._id) return user2;
    else return user1;
}

export function getGroupOrRoomIdFromRoomID(roomID) {
    const chunks = roomID.split("-");

    return chunks.length < 2 ? null : chunks[1];
}

export function stringArrayEqual(arr1, arr2) {

    if (arr1.length !== arr2.length) return false
    return arr1.filter((elem, i) => elem !== arr2[i]).length === 0

}

export function getChatTypeFromRoomId(roomID) {
    const chunks = roomID.split("-");
    const possibleTypes = [constant.ChatTypePrivate, constant.ChatTypeGroup, constant.ChatTypeRoom];
    if (chunks.length >= 2) {
        return possibleTypes.find(type => chunks[0] == type)
    }
}

export function getRandomString(length) {
    if (length == undefined) length = 32;

    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function scrollElemBottom(element) {
    if (element.scrollHeight > element.clientHeight) {
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }
}

export function getScrollBottom(element) {
    return element.scrollHeight - element.scrollTop - element.clientHeight;
}

export function url(url) {
    return config.BasePath + url;
}

export function getTimestamp(dateObj) {
    return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()} ${
        dateObj.getHours().toString().padLeft(2, '0')
        }:${
        dateObj.getMinutes().toString().padLeft(2, '0')
        }:${
        dateObj.getSeconds().toString().padLeft(2, '0')
        }`;
}

let chatName = "";
export function changeWindowTitle(newChatName) {
    chatName = newChatName;
    updateWindowTitle();
}

let unreadMessage = 0;
export function unreadMessageToWindowTitle(count) {
    unreadMessage = count;
    updateWindowTitle();
}

function updateWindowTitle() {

    document.title = config.AppTitle;

    if (chatName)
        document.title = chatName + " - " + document.title;

    if (unreadMessage > 0)
        document.title = "(" + unreadMessage + ") " + document.title;

}

export function getChatIdByHistory(historyObject) {

    let chatId = "";

    const userFrom = historyObject.user;
    const group = historyObject.group;
    const room = historyObject.room;

    if (historyObject.chatType == constant.ChatTypePrivate) {
        chatId = chatIdByUser(userFrom);
    }
    if (historyObject.chatType == constant.ChatTypeGroup) {
        chatId = chatIdByGroup(group);
    }
    if (historyObject.chatType == constant.ChatTypeRoom) {
        chatId = chatIdByRoom(room);
    }

    return chatId;
}

export function checkFileUploadSupport(serviceIdentifier) {
    return !/facebook|web/.test(serviceIdentifier)
}

export function checkStickerSupport(serviceIdentifier) {
    return !/facebook|web/.test(serviceIdentifier)
    return chatId;
}

export function sortHistoryByPin(firstObj, secondObj) {
    let firstObjPinned = firstObj.pinned || 0;
    let secondObjPinned = secondObj.pinned || 0;

    return secondObjPinned - firstObjPinned;
}

export function sortHistoryByLastUpdate(firstObj, secondObj) {
    return secondObj.lastUpdate - firstObj.lastUpdate;
}

export function stableSort(arr, comparisonFunction) {
    const arrCopy = [...arr];
    const original = [...arr];

    arrCopy.sort((x, y) => {
        let result = comparisonFunction(x, y);
        return result === 0 ? original.indexOf(x) - original.indexOf(y) : result;
    })

    return arrCopy;
}

export function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
        ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function getDateTime() {
    const d = new Date();
    const y = d.getFullYear();
    let m = d.getMonth() + 1;
    let date = d.getDate();
    const h = d.getHours();
    const min = d.getMinutes();
    const s = d.getSeconds();

    if (m < 9)
        m = "0" + m;

    if (date < 9)
        date = "0" + date;

    return y + m + date + h + min + s;

}

export function getBaseURL() {
    const baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    return baseURL;
}
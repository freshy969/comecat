export function now() {
    return new Date().getTime();
}

export function getTime(ut) {
    const t = new Date(ut);
    const formatted = t.getHours() + ":" + t.getMinutes();

    return formatted;
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

export function scrollElemBottom(element, animate) {

    let scrollTarget = 0;
    const step = 25;
    const duration = 100; // ms
    const interval = duration / step;

    if (element.scrollHeight > element.clientHeight) {
        scrollTarget = element.scrollHeight - element.clientHeight;
    }

    let currentKey = 0;
    const positions = [];

    if (animate) {

        for (let i = 0; i < step; i++) {
            const pos = element.scrollTop + (scrollTarget - element.scrollTop) / step * i;
            positions.push(pos);
        }

        const timer = window.setInterval(() => {

            if (currentKey >= positions.length) {
                element.scrollTop = scrollTarget;
                return window.clearInterval(timer);
            }

            const pos = positions[currentKey];
            element.scrollTop = pos;
            currentKey++;

        }, interval);

    } else {
        element.scrollTop = scrollTarget;
    }

}

export function getLSKeyPrefix() {

    let url = (window.location != window.parent.location)
        ? document.referrer
        : document.location.href;

    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (url.indexOf('/') !== -1) {
        url = url.split('/')[0];
    }

    return url + "_" + window.connectorId;

}

export function saveLocal(key, value) {

    const prefix = getLSKeyPrefix();

    if (window.localStorage)
        return localStorage[prefix + key] = value;

}

export function getLocal(key) {

    const prefix = getLSKeyPrefix();

    console.log('getLocal', prefix);

    if (window.localStorage)
        return localStorage[prefix + key];

}

export function removeLocal(key) {

    const prefix = getLSKeyPrefix();

    if (window.localStorage)
        return localStorage.removeItem(prefix + key);

}

export function isMob() {
    return /Android|iPhone|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

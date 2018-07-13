import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';

export function callSaveWebHookURL(url) {

    return api.post(constant.ApiUrlSaveWebhookURL, {
        url: url
    }).then((response) => {
        return Promise.resolve(response.data);
    });

}
export function callGetWebhookUrl(url) {

    return api.get(constant.ApiUrlGetWebhookURL).then((response) => {
        return Promise.resolve(response.data);
    });

}



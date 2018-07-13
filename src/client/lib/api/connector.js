import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';

export function callGetDefaultWebConnector() {

    return api.get(constant.ApiUrlLoadDefaultWebConnector).then((response) => {

        return Promise.resolve(response.data);

    });

}

export function callGetSocialConnector(snsIdentifier) {

    return api.get(constant.ApiUrlLoadGetSocialConnector + "/" + snsIdentifier).then((response) => {

        return Promise.resolve(response.data);

    });

}

export function callSaveSocialSettings(connectorIdentifier, settings) {

    return api.post(constant.ApiUrlSaveSocialSettings, {
        connectorIdentifier,
        settings
    }).then((response) => {

        return Promise.resolve(response.data);

    });

}

export function callSaveBotForConnector(connectorIdentifier, botId) {

    return api.post(constant.ApiUrlSaveBotForConnector, {
        connectorIdentifier,
        botId
    }).then((response) => {

        return Promise.resolve(response.data);

    });

}



export function callGetAllEnabledBot() {

    return api.get(constant.ApiUrlGetAllEnabledBot).then((response) => {

        return Promise.resolve(response.data);

    });

}


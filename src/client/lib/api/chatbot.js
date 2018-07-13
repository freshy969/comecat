import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';

export function callLoadChatbotSettings(chatbotIdentifier) {

    return api.get(constant.ApiUrlLoadChatBotSettings + "/" + chatbotIdentifier).then((response) => {

        return Promise.resolve(response.data);

    });

}

export function callSaveChatbotSettings(chatbotIdentifier, settings) {

    return api.post(constant.ApiUrlSaveChatBotSettings, {
        chatbotIdentifier,
        settings
    }).then((response) => {

        return Promise.resolve(response.data);

    });

}

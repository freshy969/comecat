import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';

export function callGetDefaultApiKey() {

    return api.get(constant.ApiUrlLoadDefaultApiKey).then((response) => {

        return Promise.resolve(response.data);

    });

}

export function callResetApiKey() {

    return api.post(constant.ApiUrlResetApiKey).then((response) => {

        return Promise.resolve(response.data);

    });

}

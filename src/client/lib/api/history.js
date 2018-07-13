import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';

export function callGetHistory(page) {

    return api.get(constant.ApiUrlGetHistory + page).then((response) => {

        if (!response.code || response.code != 1) {
            return Promise.reject("Failed get history");
        } else {
            return Promise.resolve(response.data);
        }

    });

}

export function callMarkAll() {

    return api.post(constant.ApiUrlMarkAll).then((response) => {

        if (!response.code || response.code != 1) {
            return Promise.reject("Failed to mark all");
        } else {
            return Promise.resolve(response.data);
        }

    });

}

export function callSearchHistory(keyword) {

    return api.get(constant.ApiUrlGetHistory + "0" + "?keyword=" + keyword).then((response) => {

        if (!response.code || response.code != 1) {
            return Promise.reject("Failed to mark all");
        } else {
            return Promise.resolve(response.data);
        }

    });

}

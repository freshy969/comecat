import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';
import user from '../user';

export function getPaymentHistory() {

    return api.get(constant.ApiUrlGetPaymentHistory)
        .then((response) => {

            if (!response.code || response.code != 1) {
                return Promise.reject("Failed save note.");
            }
            else {
                return Promise.resolve(response.data);
            }

        });
}



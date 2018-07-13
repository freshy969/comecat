import sha1 from 'sha1';

import api from './api';
import * as config from '../config';
import * as constant from '../const';
import user from '../user';

export function callLoadUsage(monthIdentifier) {

    return api.get(constant.ApiUrlLoadUsage + "/" + monthIdentifier)
        .then((response) => {

            if (!response.code || response.code != 1) {
                return Promise.reject("Failed to load usage");
            }
            else {
                return Promise.resolve(response.data);
            }

        });
}



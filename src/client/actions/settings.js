import { push, goBack } from 'react-router-redux'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callLoadUsage,
    getPaymentHistory
} from '../lib/api/';


import { store } from '../index';

export function loadUsage(monthIdentifier, isFirst) {

    return (dispatch, getState) => {

        dispatch({
            type: types.SettingsStartLoading
        });

        dispatch({
            type: types.SettingsUsageChangeMonth,
            month: monthIdentifier
        });

        callLoadUsage(monthIdentifier)
            .then((data) => {

                dispatch({
                    type: types.SettingsUsageLoadSucceed,
                    data,
                    firstLoad: isFirst
                });

            }).catch((err) => {

                dispatch({
                    type: types.SettingsUsageLoadFailed
                });

                console.error(err);
                dispatch(actions.notification.showToast(strings.FailedToLoadUsage[user.lang]));

            });

    }

}

export function loadPayments() {

    return (dispatch, getState) => {

        dispatch({
            type: types.SettingsStartLoading
        });

        getPaymentHistory()
            .then((data) => {

                dispatch({
                    type: types.SettingsPaymentsLoadSucceed,
                    data: data.payments,
                });

            }).catch((err) => {

                dispatch({
                    type: types.SettingsPaymentsLoadFailed
                });

                console.error(err);
                dispatch(actions.notification.showToast(strings.FailedToLoadPaymentHistory[user.lang]));

            });

    }

}

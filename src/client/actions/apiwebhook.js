import { push, goBack } from 'react-router-redux'
import validator from 'validator'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callGetDefaultApiKey,
    callResetApiKey,
    callSaveWebHookURL,
    callGetWebhookUrl
} from '../lib/api/';

import { store } from '../index';

export function tabClick(tab) {
    return {
        type: types.ApiTabClick,
        tab
    }
}

export function loadInitialData(userData) {

    return (dispatch, getState) => {

        dispatch({
            type: types.ApiLoadStart
        });

        callGetDefaultApiKey()
            .then((data) => {

                dispatch({
                    type: types.ApiLoadSuccess,
                    apiKey: data.apikey
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ApiLoadFailed
                });

            });

        callGetWebhookUrl()
            .then((data) => {

                dispatch({
                    type: types.ApiWebHookLoadSuccess,
                    url: data.webhook.url
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ApiWebHookLoadFailed
                });

            });


    };


}

export function resetApiKey() {

    return (dispatch, getState) => {

        dispatch({
            type: types.ApiResetStart
        });

        callResetApiKey()
            .then((data) => {

                dispatch({
                    type: types.ApiResetSuccess,
                    apiKey: data.apikey
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ApiRestFailed
                });

            });

    };


}

export function typeURL(text) {
    return {
        type: types.ApiTypeWebhookURL,
        text
    }
}

export function save() {

    return (dispatch, getState) => {

        const webhookURL = getState().api.webhookURL;

        if (webhookURL.length > 0 && !validator.isURL(webhookURL)) {

            dispatch({
                type: types.ApiSaveWebhookURLValidationError,
                error: strings.APIWebhookValidationWrongURL[user.lang]
            });

            return;
        }

        dispatch({
            type: types.ApiSaveWebhookURLStart
        });

        callSaveWebHookURL(webhookURL)
            .then((data) => {

                dispatch({
                    type: types.ApiSaveWebhookURLSucceed,
                    url: data.webhook.url
                });

                dispatch(actions.notification.showToast(strings.SucceedToSaveWebhook[user.lang]));

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ApiSaveWebhookURLFailed
                });

                dispatch(actions.notification.showToast(strings.FailedToSaveWebhook[user.lang]));

            });

    }

}



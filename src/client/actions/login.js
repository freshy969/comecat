import { push } from 'react-router-redux'

import * as types from './types';
import * as actions from '../actions';

import { callLogin, callCheckCode } from '../lib/api/';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';
import user from '../lib/user';

import { store } from '../index';

export function onLoginClick(organization, username, password, remember) {

    return (dispatch, getState) => {

        dispatch({
            type: types.LoginClick
        });

        callLogin({ organization, username, password })

            .then((response) => {

                dispatch({
                    type: types.LoginSucceed,
                    response
                });

                dispatch(actions.notification.showToast(strings.LoginSucceed[user.lang]));

                user.signinSucceed(response, remember);

                store.dispatch(push(`${util.url('/chat')}`));

            }).catch((err) => {

                dispatch({
                    type: types.LoginFailed,
                    err
                });


            });

        return Promise.resolve();

    };

}

export function onOrgChange(v) {
    return {
        type: types.LoginFormChangeOrganization,
        v
    };
}

export function onUserNameChange(v) {
    return {
        type: types.LoginFormChangeUsername,
        v
    };
}

export function onPasswordChange(v) {
    return {
        type: types.LoginFormChangePassword,
        v
    };
}

export function onRememberCheck(v) {
    return {
        type: types.LoginFormCheckRemember,
        v
    };
}

export function onLoginSucceed(data) {
    return {
        type: types.LoginSucceed,
        data
    };
}

export function checkActivationCode(code) {

    return (dispatch, getState) => {

        dispatch({
            type: types.LoginActivationCodeCheckStart,
            code
        });

        callCheckCode({ code })

            .then((response) => {

                if (response.user && response.user._id) {

                    dispatch({
                        type: types.LoginActivationCodeCheckSucceed,
                        response
                    });

                    setTimeout(() => {
                        user.signinSucceed(response, false);
                        store.dispatch(push(`${util.url('/chat')}`));
                    }, 3000)

                } else {

                    dispatch({
                        type: types.LoginActivationCodeCheckFaild
                    });

                }

            }).catch((err) => {

                dispatch({
                    type: types.LoginActivationCodeCheckFaild,
                    err
                });

                console.warn(err);

            });
    }

}

export function checkCodeDone() {
    return {
        type: types.LoginActivationCodeCheckDone
    };
}





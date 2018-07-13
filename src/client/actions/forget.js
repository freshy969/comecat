import { push } from 'react-router-redux'

import * as types from './types';
import * as actions from '../actions';

import { callForget } from '../lib/api/';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';
import user from '../lib/user';

import { store } from '../index';


export function onSubmit(email) {

    return (dispatch, getState) => {

        dispatch({
            type: types.ForgetClick
        })

        callForget({ email })

            .then((response) => {

                dispatch({
                    type: types.ForgetSucceed
                });

            }).catch((err) => {

                console.log(err);

                if (parseInt(err) == 5000002)
                    dispatch({
                        type: types.ForgetFailed,
                        err: strings.ResetPasswordError1[user.lang]
                    });
                else
                    dispatch({
                        type: types.ForgetFailed,
                        err: strings.ResetPasswordError2[user.lang]
                    });

            });

    };

}

export function onTypeEmail(v) {

    return {
        type: types.ForgetTypeEmail,
        v
    }

}


export function onValidationError(error) {

    return {
        type: types.ForgetValidationError,
        error
    }

}

export function signupDone() {

    return (dispatch, getState) => {

        dispatch({
            type: types.ForgetDone
        });

        setTimeout(() => {
            store.dispatch(push(`${util.url('/')}`));
        }, 1000);

    }

}



import { push } from 'react-router-redux'

import * as types from './types';
import * as actions from '../actions';

import { callSignup } from '../lib/api/';
import * as strings from '../lib/strings';
import * as util from '../lib/utils';
import user from '../lib/user';

import { store } from '../index';

export function onSubmit(email) {

    return (dispatch, getState) => {

        dispatch({
            type: types.SignUpClick
        })

        callSignup({ email })

            .then((response) => {

                dispatch({
                    type: types.SignUpSucceed
                });

            }).catch((err) => {

                dispatch({
                    type: types.SignUpFailed,
                    err: strings.EmailValidationError3[user.lang]
                });

            });

    };

}

export function onTypeEmail(v) {

    return {
        type: types.SignUpTypeEmail,
        v
    }

}


export function onValidationError(error) {

    return {
        type: types.SignUpValidationError,
        error
    }

}

export function signupDone() {

    return (dispatch, getState) => {

        dispatch({
            type: types.SignUpDone
        });

        setTimeout(() => {
            store.dispatch(push(`${util.url('/')}`));
        }, 1000);

    }

}



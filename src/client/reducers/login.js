import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import * as constant from '../lib/const';

const rememberChecked = localStorage.getItem(constant.LocalStorageKeyAccessToken) != null;

const loadingLogin = (state = false, action) => {
    switch (action.type) {
        case types.LoginClick:
            return true;
        case types.LoginSucceed:
            return false;
        case types.LoginFailed:
            return false;

        default:
            return state;
    }
};

const organization = (state = "", action) => {
    switch (action.type) {
        case types.LoginFormChangeOrganization:
            return action.v;
        default:
            return state;
    }
};

const username = (state = "", action) => {
    switch (action.type) {
        case types.LoginFormChangeUsername:
            return action.v;
        default:
            return state;
    }
};

const password = (state = "", action) => {
    switch (action.type) {
        case types.LoginFormChangePassword:
            return action.v;
        default:
            return state;
    }
};

const remember = (state = rememberChecked, action) => {
    switch (action.type) {
        case types.LoginFormCheckRemember:
            return action.v;
        default:
            return state;
    }
};

const activationCheckingState = (state = 0, action) => {
    switch (action.type) {
        case types.LoginActivationCodeCheckStart:
            return 1
        case types.LoginActivationCodeCheckSucceed:
            return 2
        case types.LoginActivationCodeCheckFaild:
            return 5
        case types.LoginActivationCodeCheckDone:
            return 0
        default:
            return state;
    }
};


export default combineReducers({
    loadingLogin,
    organization,
    username,
    password,
    remember,
    activationCheckingState
});;

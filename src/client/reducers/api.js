import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { isError } from 'util';

import * as constant from '../lib/const';

const tab = (state = "api", action) => {
    switch (action.type) {
        case types.ApiTabClick:
            return action.tab
        default:
            return state;
    }
}

const loading = (state = false, action) => {
    switch (action.type) {
        case types.ApiLoadStart:
            return true
        case types.ApiLoadSuccess:
            return false
        case types.ApiLoadFailed:
            return false
        default:
            return state;
    }
}

const resetLoading = (state = false, action) => {
    switch (action.type) {
        case types.ApiResetStart:
            return true
        case types.ApiResetSuccess:
            return false
        case types.ApiResetFailed:
            return false
        default:
            return state;
    }
}

const apiKey = (state = false, action) => {
    switch (action.type) {
        case types.ApiLoadSuccess:
            return action.apiKey.key
        case types.ApiResetSuccess:
            return action.apiKey.key
        default:
            return state;
    }
}

const webhookURL = (state = "", action) => {
    switch (action.type) {
        case types.ApiTypeWebhookURL:
            return action.text
        case types.ApiWebHookLoadSuccess:
            return action.url
        default:
            return state;
    }
}

const errorMessageWebHookURL = (state = "", action) => {
    switch (action.type) {
        case types.ApiSaveWebhookURLValidationError:
            return action.error
        case types.ApiSaveWebhookURLStart:
            return ""
        default:
            return state;
    }
}

const isSavingWebhook = (state = false, action) => {
    switch (action.type) {
        case types.ApiSaveWebhookURLStart:
            return true
        case types.ApiSaveWebhookURLSucceed:
            return false
        case types.ApiSaveWebhookURLFailed:
            return false
        default:
            return state;
    }
}

export default combineReducers({
    loading,
    resetLoading,
    tab,
    apiKey,
    webhookURL,
    errorMessageWebHookURL,
    isSavingWebhook
});;

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { isError } from 'util';

import * as constant from '../lib/const';

const tab = (state = "conversation", action) => {
    switch (action.type) {
        case types.ChatbotTabClick:
            return action.tab
        default:
            return state;
    }
}

const subtab = (state = "dialogflow", action) => {
    switch (action.type) {
        case types.ChatbotSubTabClick:
            return action.tab
        default:
            return state;
    }
}

const loading = (state = false, action) => {
    switch (action.type) {
        case types.ChatbotLoadStart:
            return true;
        case types.ChatbotLoadSuccess:
            return false;
        case types.ChatbotLoadFailed:
            return false;
        default:
            return state;
    }
}

const saving = (state = false, action) => {
    switch (action.type) {
        case types.ChatbotSaveStart:
            return true;
        case types.ChatbotSaveSuccess:
            return false;
        case types.ChatbotSaveFailed:
            return false;
        default:
            return state;
    }
}

const dialogflow = (state = null, action) => {

    if (action.type == types.ChatbotLoadSuccess &&
        action.settings.chatbotIdentifier == 'dialogflow') {
        return action.settings;

    } else if (action.type == types.ChatbotSaveSuccess &&
        action.settings.chatbotIdentifier == 'dialogflow') {
        return action.settings;

    } else {
        return state
    }
}

const watson = (state = null, action) => {

    if (action.type == types.ChatbotLoadSuccess &&
        action.settings.chatbotIdentifier == 'watson') {

        return action.settings;

    } else if (action.type == types.ChatbotSaveSuccess &&
        action.settings.chatbotIdentifier == 'watson') {

        return action.settings;

    } else {
        return state
    }
}

export default combineReducers({
    tab,
    subtab,
    loading,
    saving,
    dialogflow,
    watson
});;

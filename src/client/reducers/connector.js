import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { isError } from 'util';

import * as constant from '../lib/const';

const tab = (state = "web", action) => {
    switch (action.type) {
        case types.ConnectorTabClick:
            return action.tab
        default:
            return state;
    }
}

const subtab = (state = "homepage", action) => {
    switch (action.type) {
        case types.ConnectorSubTabClick:
            return action.tab
        default:
            return state;
    }
}

const loading = (state = false, action) => {
    switch (action.type) {
        case types.ConnectorLoadStart:
            return true;
        case types.ConnectorLoadSuccess:
            return false;
        case types.ConnectorLoadFailed:
            return false;
        case types.SocialConnectorLoadStart:
            return true;
        case types.SocialConnectorLoadSuccess:
            return false;
        case types.SocialConnectorLoadFailed:
            return false;

        default:
            return state;
    }
}

const saving = (state = false, action) => {
    switch (action.type) {
        case types.SocialConnectorSaveStart:
            return true;
        case types.SocialConnectorSaveSuccess:
            return false;
        case types.SocialConnectorSaveFailed:
            return false;

        default:
            return state;
    }
}


const defaultConnector = (state = null, action) => {
    switch (action.type) {
        case types.ConnectorLoadSuccess:
            console.log('action', action);
            return action.connector;
        default:
            return state;
    }
}

const facebookConnector = (state = null, action) => {

    //console.log('action.connector.connectorIdentifier', action.connector.connectorIdentifier);

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'facebook') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'facebook') {

        return action.connector;
    }


    return state;
}

const lineConnector = (state = null, action) => {

    //console.log('action.connector.connectorIdentifier', action.connector.connectorIdentifier);

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'line') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'line') {

        return action.connector;
    }


    return state;
}

const viberConnector = (state = null, action) => {

    //console.log('action.connector.connectorIdentifier', action.connector.connectorIdentifier);

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'viber') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'viber') {

        return action.connector;
    }


    return state;
}


const kikConnector = (state = null, action) => {

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'kik') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'kik') {

        return action.connector;
    }


    return state;
}


const telegramConnector = (state = null, action) => {

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'telegram') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'telegram') {

        return action.connector;
    }


    return state;
}

const twilioConnector = (state = null, action) => {

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'twilio') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'twilio') {

        return action.connector;
    }


    return state;
}

const wechatConnector = (state = null, action) => {

    if (action.type == types.SocialConnectorLoadSuccess &&
        action.connector.connectorIdentifier == 'wechat') {

        return action.connector;
    }

    else if (action.type == types.SocialConnectorSaveSuccess &&
        action.connector.connectorIdentifier == 'wechat') {

        return action.connector;
    }


    return state;
}

const chatbots = (state = [], action) => {

    switch (action.type) {
        case types.ConnectorLoadBotSuccess:
            return action.chatbots;
        default:
            return state;
    }

}

export default combineReducers({
    tab,
    subtab,
    loading,
    defaultConnector,
    facebookConnector,
    lineConnector,
    viberConnector,
    kikConnector,
    telegramConnector,
    twilioConnector,
    wechatConnector,
    saving,
    chatbots
});;

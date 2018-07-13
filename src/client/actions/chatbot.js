import { push, goBack } from 'react-router-redux'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callLoadChatbotSettings,
    callSaveChatbotSettings

} from '../lib/api/';

import { store } from '../index';

export function tabClick(tab) {
    return (dispatch, getState) => {
        dispatch({
            type: types.ChatbotTabClick,
            tab
        });

        if (tab == "conversation")
            dispatch(subtabClick('dialogflow'));

    }
}

export function subtabClick(tab) {
    return (dispatch, getState) => {

        dispatch({
            type: types.ChatbotSubTabClick,
            tab
        });

        dispatch({
            type: types.ChatbotLoadStart
        });

        callLoadChatbotSettings(
            tab
        )
            .then((data) => {

                dispatch({
                    type: types.ChatbotLoadSuccess,
                    settings: data.settings
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ChatbotLoadFailed
                });

                dispatch(
                    actions.notification.showToast(
                        strings.FailedToCallAPI[user.lang]
                    )
                );

            });


    }
}

export function saveSettings(chatbotIdentifier, settings) {

    return (dispatch, getState) => {

        dispatch({
            type: types.ChatbotSaveStart
        });

        callSaveChatbotSettings(
            chatbotIdentifier,
            settings
        )
            .then((data) => {

                console.log('datadatadata', data);

                dispatch({
                    type: types.ChatbotSaveSuccess,
                    settings: data.settings
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ChatbotSaveFailed
                });

                dispatch(
                    actions.notification.showToast(
                        strings.FailedToCallAPI[user.lang]
                    )
                );
            });
    }

}

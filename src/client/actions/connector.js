import { push, goBack } from 'react-router-redux'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callGetDefaultWebConnector,
    callGetSocialConnector,
    callSaveSocialSettings,
    callGetAllEnabledBot
} from '../lib/api/';

import { store } from '../index';


export function initConnectorsView(userData) {

    return (dispatch, getState) => {

        dispatch({
            type: types.ConnectorLoadStart
        });

        callGetDefaultWebConnector(
            userData._id
        )
            .then((data) => {

                console.log(data);

                dispatch({
                    type: types.ConnectorLoadSuccess,
                    connector: data.connector
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.ConnectorLoadFailed
                });

            });

        callGetAllEnabledBot()
            .then((data) => {

                dispatch({
                    type: types.ConnectorLoadBotSuccess,
                    chatbots: data.chatbots
                });

            }).catch((err) => {

                console.error(err);

            });


    };

}

export function tabClick(tab) {

    return (dispatch, getState) => {
        dispatch({
            type: types.ConnectorTabClick,
            tab
        });

        if (tab == "web")
            dispatch(subtabClick('homepage'));
        else if (tab == "social")
            dispatch(subtabClick('facebook'));
        else if (tab == "speaker")
            dispatch(subtabClick('alexa'));
        else if (tab == "other")
            dispatch(subtabClick('email'));

    }

}

export function subtabClick(tab) {

    return (dispatch, getState) => {

        dispatch({
            type: types.ConnectorSubTabClick,
            tab
        });

        const state = getState();

        if (state.connector.tab == "social" ||
            state.connector.tab == "other") {

            dispatch({
                type: types.SocialConnectorLoadStart
            });

            callGetSocialConnector(
                tab
            )
                .then((data) => {

                    dispatch({
                        type: types.SocialConnectorLoadSuccess,
                        connector: data.connector
                    });


                }).catch((err) => {

                    console.error(err);

                    dispatch({
                        type: types.SocialConnectorLoadFailed
                    });

                    dispatch(
                        actions.notification.showToast(
                            strings.FailedToCallAPI[user.lang]
                        )
                    );

                });

        }

    }

}

export function saveSettings(snsIdentifier, settings) {

    return (dispatch, getState) => {

        dispatch({
            type: types.SocialConnectorSaveStart
        });

        console.log('settings', settings);

        callSaveSocialSettings(
            snsIdentifier,
            settings
        )
            .then((data) => {

                dispatch({
                    type: types.SocialConnectorSaveSuccess,
                    connector: data.connector
                });

            }).catch((err) => {

                console.error(err);

                dispatch({
                    type: types.SocialConnectorSaveFailed
                });

                dispatch(
                    actions.notification.showToast(
                        strings.FailedToCallAPI[user.lang]
                    )
                );
            });
    }

}
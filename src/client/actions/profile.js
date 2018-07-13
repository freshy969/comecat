import { push, goBack } from 'react-router-redux'

import * as utils from '../lib/utils';

import * as types from './types';
import * as actions from '../actions';
import * as constant from '../lib/const';
import * as config from '../lib/config';
import * as strings from '../lib/strings';
import user from '../lib/user';

import {
    callUpdateProfile
} from '../lib/api/';

import { store } from '../index';

export function typeName(name) {

    return {
        type: types.ProfileTypeName,
        name
    }

}

export function typeDescription(description) {

    return {
        type: types.ProfileTypeDescription,
        description
    }

}

export function selectFile(file) {

    return (dispatch, getState) => {

        let reader = new FileReader();

        reader.onloadend = () => {

            dispatch({
                type: types.ProfileSelectFile,
                file,
                fileUrl: reader.result
            });

        }

        reader.readAsDataURL(file)

    }

}


export function deleteFile() {

    return {
        type: types.ProfileDeleteFile
    }

}

export function selectFileByURL(url) {

    return {
        type: types.ProfileSelectFileByURL,
        url
    }

}

export function selectFileCover(file) {

    return (dispatch, getState) => {

        let reader = new FileReader();

        reader.onloadend = () => {

            dispatch({
                type: types.ProfileSelectFileCover,
                file,
                fileUrl: reader.result
            });

        }

        reader.readAsDataURL(file)

    }

}

export function deleteFileCover() {

    return {
        type: types.ProfileDeleteFileCover
    }

}

export function selectFileCoverByURL(url) {

    return {
        type: types.ProfileSelectFileCoverByURL,
        url
    }

}

export function selectFileBg(file) {

    return (dispatch, getState) => {

        let reader = new FileReader();

        reader.onloadend = () => {

            dispatch({
                type: types.ProfileSelectFileBg,
                file,
                fileUrl: reader.result
            });

        }

        reader.readAsDataURL(file)

    }

}

export function deleteFileBg() {

    return {
        type: types.ProfileDeleteFileBg
    }

}

export function selectFileBgByURL(url) {

    return {
        type: types.ProfileSelectFileBgByURL,
        url
    }

}

export function initProfileView(user) {

    return (dispatch, getState) => {

        dispatch(typeName(user.name));
        dispatch(typeDescription(user.description));

        if (user.avatar && user.avatar.thumbnail) {
            const fileId = user.avatar.thumbnail.nameOnServer;
            dispatch(selectFileByURL(config.APIEndpoint + constant.ApiUrlGetUserAvatar + fileId));
        }

        if (user.cover && user.cover.thumbnail) {
            const fileId = user.cover.thumbnail.nameOnServer;
            dispatch(selectFileCoverByURL(config.APIEndpoint + constant.ApiUrlGetUserAvatar + fileId));
        }

        if (user.background && user.background.thumbnail) {
            const fileId = user.background.thumbnail.nameOnServer;
            dispatch(selectFileBgByURL(config.APIEndpoint + constant.ApiUrlGetUserAvatar + fileId));
        }

    }

}

export function cancel() {

    return (dispatch, getState) => {

        dispatch({
            type: types.RoomCancel
        });

        store.dispatch(goBack());

    }

}


export function save() {

    return (dispatch, getState) => {

        const state = getState();

        if (state.profile.name.length < 1) {
            dispatch({
                type: types.ProfileSaveValidationError,
                error: strings.ProfileErrorNameRequired[user.lang]
            });
            return;
        }

        dispatch({
            type: types.ProfileSaveStart
        });

        callUpdateProfile(
            state.profile.name,
            state.profile.description,
            state.profile.avatarImage,
            state.profile.coverImage,
            state.profile.bgImage
        ).then((savedUser) => {

            dispatch({
                type: types.ProfileSaveSucceed,
                user
            });

            user.updateUserData(savedUser);

            console.log('user.userData', user.userData);

            dispatch(initProfileView(user.userData));

        }).catch((err) => {

            console.error(err);

            dispatch(actions.notification.showToast(strings.FailedToSaveProfile[user.lang]));

            dispatch({
                type: types.ProfileSaveFailed
            });

        });



    }
}

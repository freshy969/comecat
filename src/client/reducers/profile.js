import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { isError } from 'util';

import * as constant from '../lib/const';

const name = (state = "", action) => {
    switch (action.type) {
        case types.ProfileTypeName:
            return action.name
        case types.ProfileSaveSucceed:
            return "";
        default:
            return state;
    }
}

const description = (state = "", action) => {
    switch (action.type) {
        case types.ProfileTypeDescription:
            return action.description;
        case types.ProfileSaveSucceed:
            return "";
        default:
            return state;
    }
}

const avatarImageUrl = (state = "", action) => {
    switch (action.type) {
        case types.ProfileSelectFile:
            return action.fileUrl;
        case types.RoomDeleteFile:
            return "";
        case types.ProfileSelectFileByURL:
            return action.url;
        default:
            return state;
    }
}

const avatarImage = (state = null, action) => {
    switch (action.type) {
        case types.ProfileSelectFile:
            return action.file
        case types.ProfileDeleteFile:
            return null;
        case types.ProfileSaveSucceed:
            return null;
        case types.ProfileSelectFileByURL:
            return {};

        default:
            return state;
    }
}

const coverImage = (state = null, action) => {
    switch (action.type) {
        case types.ProfileSelectFileCover:
            return action.file
        case types.ProfileDeleteFileCover:
            return null;
        case types.ProfileSaveSucceed:
            return null;
        case types.ProfileSelectFileCoverByURL:
            return {};

        default:
            return state;
    }
}

const coverImageUrl = (state = "", action) => {
    switch (action.type) {
        case types.ProfileSelectFileCover:
            return action.fileUrl;
        case types.ProfileDeleteFileCover:
            return "";
        case types.ProfileSelectFileCoverByURL:
            return action.url;
        default:
            return state;
    }
}

const bgImage = (state = null, action) => {
    switch (action.type) {
        case types.ProfileSelectFileBg:
            return action.file
        case types.ProfileDeleteFileBg:
            return null;
        case types.ProfileSaveSucceed:
            return null;
        case types.ProfileSelectFileBgByURL:
            return {};

        default:
            return state;
    }
}

const bgImageUrl = (state = "", action) => {
    switch (action.type) {
        case types.ProfileSelectFileBg:
            return action.fileUrl;
        case types.ProfileDeleteFileBg:
            return "";
        case types.ProfileSelectFileBgByURL:
            return action.url;
        default:
            return state;
    }
}

const saving = (state = false, action) => {
    switch (action.type) {
        case types.ProfileSaveStart:
            return true
        case types.ProfileSaveSucceed:
            return false
        case types.ProfileSaveFailed:
            return false
        default:
            return state;
    }
}

const errorMessageName = (state = null, action) => {
    switch (action.type) {
        case types.ProfileSaveValidationError:
            return action.error
        case types.ProfileSaveSucceed:
            return null
        case types.ProfileSaveFailed:
            return null
        default:
            return state;
    }
}


export default combineReducers({
    name,
    description,
    avatarImage,
    avatarImageUrl,
    coverImage,
    coverImageUrl,
    bgImage,
    bgImageUrl,
    saving,
    errorMessageName
});;

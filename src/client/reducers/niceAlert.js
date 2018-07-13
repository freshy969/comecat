import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { isError } from 'util';

import * as constant from '../lib/const';
import defaultPic from '../assets/img/logoCatBig.png';

const show = (state = false, action) => {
    switch (action.type) {
        case types.NiceAlertShow:
            return true;
        case types.NiceAlertHide:
            return false
        default:
            return state;
    }
}

const image = (state = null, action) => {
    switch (action.type) {
        case types.NiceAlertShow:
            return action.img;
        default:
            return state;
    }
}

const title = (state = "", action) => {
    switch (action.type) {
        case types.NiceAlertShow:
            console.log('action', action);
            return action.title;
        default:
            return state;
    }
}

const message = (state = "", action) => {
    switch (action.type) {
        case types.NiceAlertShow:
            return action.message;
        default:
            return state;
    }
}

export default combineReducers({
    show,
    image,
    title,
    message
});;

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import * as constant from '../lib/const';

const loading = (state = false, action) => {
    switch (action.type) {
        case types.ForgetClick:
            return true;
        case types.ForgetFailed:
            return false;
        case types.ForgetSucceed:
            return false;
        default:
            return state;
    }
};

const finished = (state = false, action) => {
    switch (action.type) {
        case types.ForgetSucceed:
            return true;
        case types.ForgetDone:
            return false;
        default:
            return state;
    }
};

const email = (state = "", action) => {
    switch (action.type) {
        case types.ForgetTypeEmail:
            return action.v;
        case types.ForgetDone:
            return ""
        default:
            return state;
    }
};

const emailValidationError = (state = "", action) => {
    switch (action.type) {
        case types.ForgetValidationError:
            return action.error;
        case types.ForgetFailed:
            return action.err
        case types.ForgetSucceed:
            return ""
        default:
            return state;
    }
};

export default combineReducers({
    email,
    emailValidationError,
    loading,
    finished
});;

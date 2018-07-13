import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import * as constant from '../lib/const';

const loading = (state = false, action) => {
    switch (action.type) {
        case types.SignUpClick:
            return true;
        case types.SignUpFailed:
            return false;
        case types.SignUpSucceed:
            return false;
        default:
            return state;
    }
};

const finished = (state = false, action) => {
    switch (action.type) {
        case types.SignUpSucceed:
            return true;
        case types.SignUpDone:
            return false;
        default:
            return state;
    }
};

const email = (state = "", action) => {
    switch (action.type) {
        case types.SignUpTypeEmail:
            return action.v;
        case types.SignUpDone:
            return ""
        default:
            return state;
    }
};

const emailValidationError = (state = "", action) => {
    switch (action.type) {
        case types.SignUpValidationError:
            return action.error;
        case types.SignUpFailed:
            return action.err
        case types.SignUpSucceed:
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

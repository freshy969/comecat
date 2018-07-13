import { combineReducers } from "redux";

import * as types from '../constants/ActionTypes';

const name = (state = "", action) => {
  switch (action.type) {
    case types.TYPE_NAME:
      return action.text
    default:
      return state;
  }
}

const email = (state = "", action) => {
  switch (action.type) {
    case types.TYPE_EMAIL:
      return action.text
    default:
      return state;
  }
}

const validationResult = (state = null, action) => {
  switch (action.type) {
    case types.USERFORM_VALIDATION:
      return action.result
    default:
      return state;
  }
}

const hide = (state = false, action) => {
  switch (action.type) {
    case types.LOAD_MESSAGES:
      return true
    default:
      return state;
  }
}

const loading = (state = false, action) => {
  switch (action.type) {
    case types.USERFORM_SEND:
      return true
    default:
      return state;
  }
}

const connectors = (state = {}, action) => {
  switch (action.type) {
    case types.START_INITIAL:
      return action.connectors
    default:
      return state;
  }
}


export default combineReducers({
  name,
  email,
  validationResult,
  hide,
  loading,
  connectors
});;

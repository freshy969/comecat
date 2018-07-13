import { combineReducers } from "redux";

import * as types from '../constants/ActionTypes';

const show = (state = false, action) => {
  switch (action.type) {
    case types.START_CHAT:
      return true
    case types.START_INITIAL:
      return true
    case types.START_CHAT_FAILED:
      return true
    default:
      return state;
  }
}

const showUserForm = (state = true, action) => {
  switch (action.type) {
    case types.START_CHAT:
      return false
    case types.START_INITIAL:
      return true
    case types.START_CHAT_FAILED:
      return true
    default:
      return state;
  }
}

const mode = (state = "window", action) => {
  switch (action.type) {
    case types.START_INITIAL:
      return action.mode
    default:
      return state;
  }
}

export default combineReducers({
  show,
  mode,
  showUserForm
});;

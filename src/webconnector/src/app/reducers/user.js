import { combineReducers } from "redux";

import * as config from '../lib/config';
import * as types from '../constants/ActionTypes';

const userId = (state = "", action) => {
  switch (action.type) {
    case types.USER_FETCHED:
      return action.user.id;
    default:
      return state;
  }
}

export default combineReducers({
  userId
});;

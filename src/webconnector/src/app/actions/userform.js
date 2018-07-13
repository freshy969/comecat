import * as types from '../constants/ActionTypes';
import { now } from '../lib/Utils';

import SpikaConnector from '../lib/SpikaConnector';

import * as actions from './index';

export function typeName(text) {

  return {
    type: types.TYPE_NAME,
    text
  };

}

export function typeEmail(text) {

  return {
    type: types.TYPE_EMAIL,
    text
  };

}

export function validation(result) {

  return {
    type: types.USERFORM_VALIDATION,
    result
  };

}


export function skip() {

  return send("", "");

}


export function send(name, email) {

  return (dispatch, getState) => {

    dispatch({
      type: types.USERFORM_SEND,
      user: {
        name: name,
        email: email,
      }
    });

    dispatch(actions.chat.startChat(name, email));

  }

}


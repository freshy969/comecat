import * as types from '../constants/ActionTypes';
import { now } from '../lib/Utils';

import SpikaConnector from '../lib/SpikaConnector';

export function showInitial(mode) {

  return (dispatch, getState) => {

    SpikaConnector.getAgent().then(({ agent, webconnector, connectors }) => {

      dispatch({
        type: types.START_INITIAL,
        mode,
        agent,
        webconnector,
        connectors
      });

    });

  };

}

export function startChat(name, email) {

  return (dispatch, getState) => {

    SpikaConnector.signinAsGuest('personal', name, email).then((user) => {

      return Promise.resolve(user);

    }).then(() => {

      return SpikaConnector.getMessages(0, "new");

    }).then((messages) => {

      dispatch({
        type: types.LOAD_MESSAGES,
        messages
      });

      setTimeout(() => {

        dispatch({
          type: types.START_CHAT,
        });

      }, 1000);

    }).catch((error) => {

      console.error(error);

      dispatch(showInitial(window.mode ? window.mode : "window"));

    });

  }

}

export function typeText(text) {

  return {
    type: types.TYPE_TEXT,
    text
  };

}

export function loadPastMessage(messageId) {

  return (dispatch, getState) => {

    SpikaConnector.getMessages(messageId, "old").then((messages) => {

      dispatch({
        type: types.LOAD_PAST_MESSAGES,
        messages
      });

    }).catch((error) => {
      console.log(error);
    });


  }

}

export function receiveMessage(message) {

  return (dispatch, getState) => {

    setTimeout(() => {
      dispatch({
        type: types.MESSAGE_RECEIVED,
        message
      });
    }, 500);

  }

}

export function sendMessageDataCreated(message) {

  return {
    type: types.MESSAGE_SEND_DATA,
    message
  };

}

export function sendMessage(text) {

  return (dispatch, getState) => {

    dispatch({
      type: types.START_SENDING_MESSAGE,
      text
    });

    SpikaConnector.processSendText(text).then((result) => {

      dispatch({
        type: types.MESSAGE_SENT
      });

      console.log(result);

    }).catch((error) => {
      console.log(error);
    });

  }

}

export function showTyping() {

  return {
    type: types.SHOW_TYPING
  };

}

export function hideTyping() {

  return {
    type: types.HIDE_TYPING
  };

}

export function startFileUpload(file) {

  return (dispatch, getState) => {

    dispatch({
      type: types.START_FILE_UPLOAD,
      file
    });

    SpikaConnector.sendFile(file, (progress) => {

      dispatch({
        type: types.FILE_UPLOAD_PROGRESS,
        progress
      });

    }).then((response) => {

      dispatch(finishFileUpload());

    });
  }

}

export function updateFileUploadProgress(progress) {

  return {
    type: types.FILE_UPLOAD_PROGRESS,
    progress
  };

}

export function finishFileUpload() {

  return {
    type: types.FINISH_FILE_UPLOAD
  };

}

export function setBackgroundImage(url) {

  return {
    type: types.SET_BACKGROUND_IMAGE,
    url
  };

}
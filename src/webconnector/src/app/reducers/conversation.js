import { combineReducers } from "redux";

import * as types from '../constants/ActionTypes';
import * as config from '../lib/config';
import * as utils from '../lib/Utils';

const messageText = (state = "", action) => {
  switch (action.type) {
    case types.TYPE_TEXT:
      return action.text
    default:
      return state;
  }
}

const messages = (state = [], action) => {

  let currentMessages = state;

  if (action.type == types.MESSAGE_SEND_DATA) {

    currentMessages = currentMessages.concat(action.message);

  }

  else if (action.type == types.MESSAGE_RECEIVED) {

    const isMyMessage = currentMessages.find((oldmessage) => {
      return oldmessage.localID == action.message.localID;
    });

    if (!isMyMessage)
      currentMessages = currentMessages.concat(action.message);

    else {

      currentMessages = currentMessages.map((oldmessage) => {

        if (oldmessage.localID == action.message.localID)
          return action.message;
        else
          return oldmessage;

      });

    }

  }

  else if (action.type == types.LOAD_MESSAGES) {

    currentMessages = currentMessages.concat(action.messages);

  }

  else if (action.type == types.LOAD_PAST_MESSAGES) {

    currentMessages = action.messages.concat(currentMessages);

  }

  else if (action.type == types.SHOW_TYPING) {

    const typingMessage = {
      targetType: 3,
      type: -1,
      localID: utils.getRandomString(),
      userId: "agent",
      message: "",
      created: utils.now()
    };

    const exisingTypingMessage = currentMessages.find((msg) => {

      return msg.messageType == -1;

    });

    if (!exisingTypingMessage)
      currentMessages = currentMessages.concat(typingMessage);

  }

  else if (action.type == types.HIDE_TYPING) {

    currentMessages = currentMessages.filter((msg) => {

      return msg.type != -1;

    });

  }


  const sortedArray = currentMessages.sort((msg1, msg2) => {

    if (msg1.type == -1)
      return 1;

    if (msg1.created > msg2.created)
      return 1;

    else if (msg1.created < msg2.created)
      return -1;

    else
      0;

  });

  return sortedArray;

}

const fileUploading = (state = false, action) => {
  switch (action.type) {
    case types.START_FILE_UPLOAD:
      return true;
    case types.FINISH_FILE_UPLOAD:
      return false;
    default:
      return state;
  }
}

const fileUploadingProgress = (state = 0, action) => {
  switch (action.type) {
    case types.START_FILE_UPLOAD:
      return 0;
    case types.FINISH_FILE_UPLOAD:
      return 100;
    case types.FILE_UPLOAD_PROGRESS:
      return action.progress;

    default:
      return state;
  }
}


export default combineReducers({
  messageText,
  messages,
  fileUploading,
  fileUploadingProgress
});;

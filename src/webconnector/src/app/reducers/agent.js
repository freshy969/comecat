import { combineReducers } from "redux";

import * as config from '../lib/config';
import * as types from '../constants/ActionTypes';

const name = (state = "", action) => {
  switch (action.type) {
    case types.AGENT_FETCHED:
      return action.agent.name;
    default:
      return state;
  }
}

const avatarURL = (state = "", action) => {

  if (action.type == types.AGENT_FETCHED) {

    if (action.agent &&
      action.agent.avatar &&
      action.agent.avatar.thumbnail) {

      return config.AvatarBaseURL + action.agent.avatar.thumbnail.nameOnServer

    } else {

      return config.AvatarBaseURL + action.agent._id;

    }

  }

  return state;

}

const coverURL = (state = "", action) => {

  if (action.type == types.AGENT_FETCHED) {

    if (action.agent &&
      action.agent.cover &&
      action.agent.cover.picture) {

      return config.AvatarBaseURL + action.agent.cover.picture.nameOnServer

    }

  }

  return state;

}

const backgroundURL = (state = "", action) => {

  if (action.type == types.AGENT_FETCHED) {

    if (action.agent &&
      action.agent.background &&
      action.agent.background.picture) {

      return config.AvatarBaseURL + action.agent.background.picture.nameOnServer

    }

  }
  if (action.type == types.SET_BACKGROUND_IMAGE) {
    return action.url;
  }

  return state;

}


const description = (state = "", action) => {
  switch (action.type) {
    case types.AGENT_FETCHED:
      return action.agent.description;
    default:
      return state;
  }
}

const agentId = (state = "", action) => {
  switch (action.type) {
    case types.AGENT_FETCHED:
      return action.agent.id;
    default:
      return state;
  }
}

const agent = (state = null, action) => {
  switch (action.type) {
    case types.AGENT_FETCHED:
      return action.agent;
    default:
      return state;
  }
}


export default combineReducers({
  name,
  avatarURL,
  coverURL,
  backgroundURL,
  description,
  agentId,
  agent
});;

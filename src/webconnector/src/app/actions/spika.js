import * as types from '../constants/ActionTypes';
import { now } from '../lib/Utils';

import SpikaConnector from '../lib/SpikaConnector';

export function agentFetched(agent) {

  return {
    type:types.AGENT_FETCHED,
    agent
  };

}

export function userFetched(user) {

  return {
    type:types.USER_FETCHED,
    user
  };

}

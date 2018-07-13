import {combineReducers} from 'redux';

import windowstate from './windowstate';
import conversation from './conversation';
import agent from './agent';
import user from './user';
import userform from './userform';

const rootReducer = combineReducers({
  windowstate,
  conversation,
  agent,
  user,
  userform
});

export default rootReducer;

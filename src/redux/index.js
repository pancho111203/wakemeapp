import { combineReducers } from 'redux'
import chat from './chat';
import alarms from './alarms';

const reducers = combineReducers({
  chat,
  alarms
})

export default reducers;
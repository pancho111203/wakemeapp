import { append } from 'ramda';
import moment from 'moment';

const SET_ALARM = 'alarms/set_alarm';
const POSTPONE_ALARM = 'alarms/postpone_alarm';
const RING_ALARM = 'alarms/ring_alarm';
const REMOVE_ALARM = 'alarms/remove_alarm';
const SET_CURR_TIME = 'alarms/set_curr_time';

const initialState = {
  alarm: {},
  currTime: moment().format()
}

export const setCurrTime = (currTime) => {
  return {
    type: SET_CURR_TIME,
    currTime
  }
}

export const setAlarm = (config) => {
  return {
    type: SET_ALARM,
    config,
  }
}

export const ringAlarm = () => {
  return {
    type: RING_ALARM
  }
}

export const removeAlarm = () => {
  return {
    type: REMOVE_ALARM
  }
}

export const postponeAlarm = (nextRingTime) => {
  return {
    type: POSTPONE_ALARM,
    nextRingTime
  }
}

const alarms = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALARM:
      return {
        ...state,
        alarm: action.config
      }
    case RING_ALARM:
      return {
        ...state,
        alarm: { ...state.alarm, state: 'RINGING' }
      }
    case POSTPONE_ALARM:
      return {
        ...state,
        alarm: { ...state.alarm, state: 'WAITING', nextRingTime: action.nextRingTime }
      }
    case REMOVE_ALARM:
      return {
        ...state,
        alarm: initialState.alarm
      }
    case SET_CURR_TIME:
      return {
        ...state,
        currTime: action.currTime
      }
    default:
      return state
  }
}

export default alarms;

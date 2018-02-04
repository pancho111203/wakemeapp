import moment from 'moment';
import { INTENTS } from '../globals';
import { setAlarm, ringAlarm, postponeAlarm, setCurrTime, removeAlarm } from '../redux/alarms';
import { addChatLine } from '../redux/chat';
import { durationDialogFlowToMoment } from '../utils/utils';

class AlarmManager {
  constructor(store, dialogFlow, synthController) {
    this.store = store;
    this.dialogFlow = dialogFlow;
    this.synthController = synthController;

    // Change current time every second
    setInterval(() => {
      const currTime = moment();
      const currAlarm = this.store.getState().alarms.alarm;
      if (currAlarm && currAlarm.nextRingTime && currAlarm.state !== 'RINGING' && moment(currAlarm.nextRingTime).isBefore(currTime)) {
        this.ringAlarm();
      }
      this.store.dispatch(setCurrTime(currTime.format()));
    }, 1000);

    this.dialogFlow.onResponse(INTENTS.DEACTIVATE_ALARM, (speech, parameters, isIncomplete) => {
      if (isIncomplete) {
        return;
      }

      const alarm = this.store.getState().alarms.alarm;
      if (!alarm) {
        this.synthController.speak('No hay ninguna alarma activa');
        this.store.dispatch(addChatLine('No hay ninguna alarma activa', false));
        return;
      }

      this.store.dispatch(addChatLine(speech, false));
      this.synthController.speak(speech);

      console.log('deactivating alarm');
      this.store.dispatch(removeAlarm())
    })

    this.dialogFlow.onResponse(INTENTS.SET_UP_ALARM, (speech, parameters, isIncomplete) => {
      // TODO en vez de aceptar esto siempre, comprobar que no haya una alarma puesta, y pedir una confirmacion para sustituir si la hay
      this.store.dispatch(addChatLine(speech, false));
      this.synthController.speak(speech);

      if (isIncomplete) {
        return;
      }

      const timeToWakeUp = parameters.time1;
      console.log(`setting up alarm at ${timeToWakeUp}`);
      this.setUpAlarm(timeToWakeUp);
    });

    this.dialogFlow.onResponse(INTENTS.POSTPONE_ALARM, (speech, parameters, isIncomplete) => {
      const currentAlarm = this.store.getState().alarms.alarm;
      if (!currentAlarm || !currentAlarm.state || currentAlarm.state !== 'RINGING') {
        console.log('trying to postpone an alarm, but none is ringing');
        this.synthController.speak('No hay ninguna alarma sonando!');
        this.store.dispatch(addChatLine('No hay ninguna alarma sonando!', false));
        // TODO send something to dialogflow to indicate to stop the flow (if its in the middle of it)
        return;
      }

      this.store.dispatch(addChatLine(speech, false));
      this.synthController.speak(speech);

      if (isIncomplete) {
        return;
      }

      if (!parameters.duration) {
        return;
      }
      const momentUnit = durationDialogFlowToMoment[parameters.duration.unit];
      if (momentUnit) {
        const postponeTime = moment.duration(parameters.duration.amount, momentUnit);
        const timeToRing = moment().add(postponeTime);
        this.store.dispatch(postponeAlarm(timeToRing.format()));
      }
    })
  }

  setUpAlarm = (timeToWakeUp) => {
    const currentAlarm = this.store.getState().alarms.alarm;

    let timeRelative = moment(timeToWakeUp, 'hhmmss');
    if (!timeRelative.isAfter(moment())) {
      timeRelative = timeRelative.add(1, 'd');
    }

    this.store.dispatch(setAlarm({
      initialRingTime: timeRelative.format(),
      nextRingTime: timeRelative.format(),
      state: 'WAITING'
    }));
  }

  ringAlarm = () => {
    // TODO DC check si 'time' es igual a 'moment()', y sino volver a setupearla
    const alarm = this.store.getState().alarms.alarm;
    console.log(`ringing alarm ${alarm}`);
    this.store.dispatch(ringAlarm());
  }
}

export default AlarmManager;

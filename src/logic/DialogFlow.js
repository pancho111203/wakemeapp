import { ApiAiClient } from "api-ai-javascript";
import { addChatLine } from '../redux/chat';
import { INTENTS } from '../globals';

class DialogFlow {
  constructor(store, synthController) {
    this.responseCallbacks = {};

    this.synthController = synthController;
    this.store = store;
    this.client = new ApiAiClient({ accessToken: '0fa79e16bcdc49b79caf9ac181966eb0' });

    this.onResponse(INTENTS.FALLBACK, (spoken) => {
      this.store.dispatch(addChatLine(spoken, false));
      this.synthController.speak(spoken);
    });

    this.onResponse(INTENTS.WELCOME, (spoken) => {
      this.store.dispatch(addChatLine(spoken, false));
      this.synthController.speak(spoken);
    });
  }

  onResponse = (intent, callback) => {
    if (this.responseCallbacks[intent]) {
      this.responseCallbacks[intent] = this.responseCallbacks[intent].push(callback);
    } else {
      this.responseCallbacks[intent] = [callback];
    }
  }

  handleResponse = (res) => {
    const result = res.result;
    console.log(result);
    // pass to appropiate callbacks
    const action = result.action;
    const isIncomplete = result.actionIncomplete;
    const intentId = result.metadata.intentId;
    const parameters = result.parameters;
    const speech = result.fulfillment.speech;
    if (this.responseCallbacks[intentId]) {
      this.responseCallbacks[intentId].forEach((cb) => {
        cb(speech, parameters, isIncomplete);
      });
    }
  }

  handleError = (err) => {
    console.error('ERROR IN THE DIALOGFLOW RESPONSE');
    console.error(err);
  }

  sendText = (text) => {
    this.store.dispatch(addChatLine(text, true));
    this.client.textRequest(text).then(this.handleResponse).catch(this.handleError);
  }

  sendEvent = (eventName, options = {}) => {
    this.client.eventRequest(eventName, options).then(this.handleResponse).catch(this.handleError);
  }
}

export default DialogFlow;

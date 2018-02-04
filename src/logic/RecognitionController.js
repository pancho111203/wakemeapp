import * as _ from 'ramda';

class RecognitionController {
  constructor(store, initialLang, maxAlternatives) {
    this.store = store;
    this.isPaused = false;
    this.onResultCallbacks = [];
    this.onErrorCallbacks = [];
    this.onListeningCallbacks = [];
    this.onPausedCallbacks = [];

    this.speech = new webkitSpeechRecognition(); // eslint-disable-line
    this.speech.maxAlternatives = maxAlternatives || 10;
    this.speech.interimResults = false;
    this.speech.lang = initialLang || 'es-ES';
    this.speech.continuous = false;

    this.speech.onend = (e) => {
      this.onPausedCallbacks.forEach((callback) => {
        callback();
      });
    };

    this.speech.onresult = (result) => {
      this.onResultCallbacks.forEach((callback) => {
        callback(result);
      });
    };

    this.speech.onerror = (error) => {
      this.onErrorCallbacks.forEach((callback) => {
        callback(error);
      });
    };

    this.speech.onstart = () => {
      this.onListeningCallbacks.forEach((callback) => {
        callback();
      });
    };
  }

  startSafe = () => {
    try {
      this.speech.start();
    } catch (e) {
      if (e.code === 11) console.log('Already started!');
      else console.error(e);
    }
  }

  resume = () => {
    this.isPaused = false;
    this.startSafe();
  }

  pause = () => {
    this.isPaused = true;
    this.speech.stop();
  }

  restart = () => {
    this.speech.stop();
  }

  changeLanguage = (lang) => {
    this.speech.lang = lang;
    this.restart();
  }

  onResult = (callback) => {
    this.onResultCallbacks.push(callback);
  }

  onError = (callback) => {
    this.onErrorCallbacks.push(callback);
  }

  onListening = (callback) => {
    this.onListeningCallbacks.push(callback);
  }

  onPaused = (callback) => {
    this.onPausedCallbacks.push(callback);
  }

  getTranscriptOfResult = (result) => {
    const results = result.results;
    if (results && results.length > 0) {
      const res = _.nth(0, results);
      if (res) {
        const alt = _.nth(0, res);
        if (alt) {
          return alt.transcript || null;
        }
      }
    }
    return null;
  }
}

export default RecognitionController;

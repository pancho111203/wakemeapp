import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import RecognitionController from '../logic/RecognitionController';
import SynthController from '../logic/SynthController';
import DialogFlow from '../logic/DialogFlow';
import AlarmManager from '../logic/AlarmManager';
import Chat from './Chat';
import Alarm from './Alarm';
import Microphone from './Microphone';
import { colors } from '../theme';
import Time from './Time';

class App extends Component {
  constructor(props) {
    super(props);
    this.recognitionController = new RecognitionController(this.props.store);
    this.synthController = new SynthController(this.props.store);
    this.dialogFlow = new DialogFlow(this.props.store, this.synthController);
    this.alarmManager = new AlarmManager(this.props.store, this.dialogFlow, this.synthController);
    this.audioElement = null;
    this.recognitionController.onResult((res) => {
      const spokenText = this.recognitionController.getTranscriptOfResult(res);
      if (spokenText) {
        console.log(`sending spoken text to dialof flow: "${spokenText}"`);
        this.dialogFlow.sendText(spokenText)
      }
    });
  }

  componentDidMount() {
    this.dialogFlow.sendEvent('WELCOME');
  }

  getPreloadedAudio = () => {
    var req = new XMLHttpRequest();
    req.open('GET', 'early-sunrise.mp3', true);
    req.responseType = 'blob';
    const _this = this;
    req.onload = function () {
      // Onload is triggered even on 404
      // so we need to check the status code
      if (this.status === 200) {
        var audioBlob = this.response;
        var audio = URL.createObjectURL(audioBlob); // IE10+

        _this.audioElement.src = audio;
      }
    }
    req.onerror = function () {
      console.error('error downloading audio file');
    }

    req.send();
  }

  getChildContext() {
    return {
      dialogFlow: this.dialogFlow,
      synthController: this.synthController,
      recognitionController: this.recognitionController
    };
  }

  render() {
    const containerStyle = this.props.alarm.state === 'RINGING' ? { ...styles.container, ...styles.containerRinging } : styles.container;
    return (
      <div style={containerStyle}>
        <audio ref={(el) => { this.audioElement = el; this.getPreloadedAudio(); }} loop preload="auto">
          <source src="early-sunrise.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <div style={styles.topSection}>
          <Time />
          <Alarm audio={this.audioElement} config={this.props.alarm} />
        </div>
        <Chat />
        <Microphone />
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    height: '100vh',
    backgroundColor: colors.primary
  },
  containerRinging: {
    backgroundColor: colors.alarm
  },
  topSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

App.childContextTypes = {
  dialogFlow: PropTypes.object,
  recognitionController: PropTypes.object,
  synthController: PropTypes.object
};

const mapStateToProps = ({ alarms }) => {
  return {
    alarm: alarms.alarm
  }
}

export default connect(mapStateToProps)(App);

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
        <div style={styles.topSection}>
          <Time />
          <Alarm config={this.props.alarm} />
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

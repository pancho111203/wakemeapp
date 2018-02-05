import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';
import moment from 'moment';
import { colors } from '../theme';
const RING_INTERVAL = 5000;

class Alarm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.ringInterval = null;

    this.state = {
      speakingGapOn: false
    };
  }

  componentWillReceiveProps(newProps, newState) {
    if (this.props.config.state !== newProps.config.state) {
      if (newProps.config.state === 'RINGING') {
        this.startRinging();
      } else {
        this.stopRinging();
      }
    }
  }

  componentWillUpdate(newProps, newState) {
    if (newProps.config.state === 'RINGING') {
      // should start listening for voice
      if (!this.state.speakingGapOn && newState.speakingGapOn) {
        this.context.recognitionController.resume();
      }

      // should stop listening for voice
      if (this.state.speakingGapOn && !newState.speakingGapOn) {
        this.context.recognitionController.pause();
      }
    }
  }

  componentWillUnmount() {
    this.context.recognitionController.pause();
  }

  startRinging = () => {
    this.ringInterval = setInterval(() => {
      this.setState({
        speakingGapOn: !this.state.speakingGapOn
      });
    }, RING_INTERVAL);
  }

  stopRinging = () => {
    clearInterval(this.ringInterval);
    this.context.recognitionController.pause();
    this.setState({
      speakingGapOn: false
    });
  }

  render() {
    const config = this.props.config;
    if (!config.nextRingTime) {
      return (
        <p style={styles.noAlarmActive}>No hay ninguna alarma activada</p>
      )
    }
    const nextRingTime = config.nextRingTime;
    const shouldBeRinging = !this.state.speakingGapOn && this.props.config.state === 'RINGING' ? true : false;
    return (
      <div>
        <Sound url="early-sunrise.mp3" autoLoad={true} playStatus={shouldBeRinging ? Sound.status.PLAYING : Sound.status.PAUSED} loop={true} />
        {this.props.config.state === 'RINGING' ?
          <div style={{ ...styles.alarm, ...styles.ringingAlarm }}>
            Hora de levantarse!
          </div> : 
          <div style={{ ...styles.alarm, ...styles.waitingAlarm }}>
            La alarma sonara a las {moment(nextRingTime).format('HH:mm:ss')}
          </div>}
      </div>
    );
  }
}

const styles = {
  container: {

  },
  noAlarmActive: {
    color: 'white',
    textAlign: 'center'
  },
  alarm: {
    height: 45,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    color: colors.primary,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  ringingAlarm: {

  },
  waitingAlarm: {

  }
}

Alarm.contextTypes = {
  recognitionController: PropTypes.object
}

export default Alarm;

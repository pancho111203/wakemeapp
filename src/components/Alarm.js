import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';

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
    const shouldBeRinging = !this.state.speakingGapOn && this.props.config.state === 'RINGING' ? true : false;
    return (
      <div>
        <Sound url="early-sunrise.mp3" playStatus={shouldBeRinging ? Sound.status.PLAYING : Sound.status.PAUSED} loop={true} />
        {config.nextRingTime}
      </div>
    );
  }
}

Alarm.contextTypes = {
  recognitionController: PropTypes.object
}

export default Alarm;

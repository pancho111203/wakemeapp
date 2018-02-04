import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../theme';

class Microphone extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      listening: false
    };

    this.context.recognitionController.onListening(() => {
      this.setState({
        listening: true
      });
    });

    this.context.recognitionController.onPaused(() => {
      this.setState({
        listening: false
      });
    });
  }

  handleClick = () => {
    if (this.state.listening) {
      this.context.recognitionController.pause();
    } else {
      this.context.recognitionController.resume();
    }
  }

  render() {
    return (
      <div onClick={this.handleClick} style={styles.container}>
        {this.state.listening ? <img style={styles.img} src="mic_on.svg"/> : <img style={styles.img} src="mic_off.svg"/>}
      </div>
    );
  }
}

const styles = {
  container: {
    marginBottom: 50,
    width: 102,
    height: 102,
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  img: {
    width: 40,
    height: 40
  }
}

Microphone.contextTypes = {
  recognitionController: PropTypes.object
};

export default Microphone;

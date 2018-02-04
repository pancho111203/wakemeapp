import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { colors } from '../theme';

class Time extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const formattedTime = moment(this.props.currTime).format('HH:mm:ss')
    return (
      <div style={styles.container}>
        <div style={styles.time}>{formattedTime}</div>
      </div>
    );
  }
}

const styles = {
  container: {
    marginTop: 28,
    backgroundColor: colors.secondary,
    height: 58,
    width: '80%',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  time: {
    color: 'white',
    fontSize: '2em'
  }
}

const mapStateToProps = ({ alarms }) => {
  return {
    currTime: alarms.currTime
  }
}

export default connect(mapStateToProps)(Time);

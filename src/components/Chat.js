import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {colors} from '../theme';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEnd = null;
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    return (
      <div style={styles.container}>
        {this.props.chatHistory.map((chatLine) => {
          let dialogStyle = chatLine.iamSpeaker ? styles.ownDialog : styles.otherDialog;
          dialogStyle = { ...styles.dialog, ...dialogStyle };
          return (
            <div style={dialogStyle}>
              <p style={styles.chatLine}>{chatLine.text}</p> 
            </div>
          );
        })}
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '50%',
    overflow: 'scroll'
  },
  chatLine: {
    color: 'black'
  },
  dialog: {
    borderRadius: 34,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 7
  },
  ownDialog: {
    alignSelf: 'flex-end',
    backgroundColor: colors.green
  },
  otherDialog: {
    backgroundColor: 'white',
    alignSelf: 'flex-start'
  }
}

Chat.contextTypes = {
  dialogFlow: PropTypes.object,
  synthController: PropTypes.object,
  recognitionController: PropTypes.object
};

const mapStateToProps = ({ chat }) => {
  return {
    chatHistory: chat.chatLines
  }
}


export default connect(mapStateToProps, null)(Chat);

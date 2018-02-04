import { append } from 'ramda';

const ADD_CHAT_LINE = 'chats/add_chat_line';


const initialState = {
  chatLines: []
}

export const addChatLine = (text, iamSpeaker) => {
  return {
    type: ADD_CHAT_LINE,
    text,
    iamSpeaker
  }
}

const chat = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHAT_LINE:
      const newChatLines = append({ text: action.text, iamSpeaker: action.iamSpeaker }, state.chatLines);
      return {
        ...state,
        chatLines: newChatLines,
      }
    default:
      return state
  }
}

export default chat;

// messagesSlice.js TBA
import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    messagesCount: null,
    sentOperation: false,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessagesCount: (state, action) => {
      state.messagesCount = action.payload;
    },
    setOperation: (state, action) => {
      state.sentOperation = action.payload;
    },
    clearMessages: (state, action) => {
      state.messages = [];
      state.messagesCount = null;
      state.sentOperation = false;
    },
  },
});

export const { setMessages, setMessagesCount, setOperation, clearMessages } =
  messagesSlice.actions;
export const selectMessages = (state) => state.messages.messages;
export const selectMessagesCount = (state) => state.messages.messagesCount;
export const selectOperationState = (state) => state.messages.sentOperation;
export const deleteMessages = (initialState) => initialState;

export default messagesSlice.reducer;

// messagesSlice.js TBA 
import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    messagesCount: 0,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessagesCount: (state, action) => {
      state.messagesCount = action.payload;
    },
    clearMessages: (state, action) => {
      state.messages = null;
      state.messagesCount = null;
    },
  },
});

export const { setMessages, setMessagesCount, clearMessages } =
  messagesSlice.actions;
export const selectMessages = (state) => state.messages.messages;
export const selectMessagesCount = (state) => state.messages.messagesCount;
export const deleteMessages = (initialState) => initialState;

export default messagesSlice.reducer;

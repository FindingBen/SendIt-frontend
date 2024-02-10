import { createSlice } from "@reduxjs/toolkit";

const contactListSlice = createSlice({
  name: "contactLists",
  initialState: { contactLists: [], listChange: false },
  reducers: {
    setContactLists: (state, action) => {
      return {
        ...state,
        contactLists: action.payload.contactLists,
        listChange: action.payload.listChange,
      };
    },
    cleanContactLists: (state, action) => {
      return { contactLists: [], listChange: false };
    },
  },
});

export const { setContactLists, cleanContactLists } = contactListSlice.actions;
export const selectContactLists = (state) => state.contactLists;

export default contactListSlice.reducer;

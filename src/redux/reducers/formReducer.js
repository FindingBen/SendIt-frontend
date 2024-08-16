import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form_state",
  initialState: { isDirty: false },
  reducers: {
    setState: (state, action) => {
      const { isDirty } = action.payload;
      state.isDirty = isDirty;
    },
  },
});

export const { setState } = formSlice.actions;

export default formSlice.reducer;

export const selectFormState = (state) => state.archiveState.isDirty;

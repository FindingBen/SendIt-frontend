import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal_state",
  initialState: { show: false },
  reducers: {
    setModalState: (state, action) => {
      const { show } = action.payload;
      state.show = show;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export default modalSlice.reducer;

export const selectModalState = (state) => state.modalState.show;

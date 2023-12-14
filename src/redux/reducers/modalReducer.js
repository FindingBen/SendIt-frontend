import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal_state",
  initialState: { show: false, open: false },
  reducers: {
    setModalState: (state, action) => {
      const { show } = action.payload;
      state.show = show;
    },
    setOpenModal: (state, action) => {
      const { open } = action.payload;
      state.open = open;
    },
  },
});

export const { setModalState, setOpenModal } = modalSlice.actions;

export default modalSlice.reducer;

export const selectModalState = (state) => state.modalState.show;
export const selectModalCall = (state) => state.modalState.open;

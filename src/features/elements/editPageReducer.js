import { createSlice } from "@reduxjs/toolkit";

const EditPageSlice = createSlice({
  name: "editPage_state",
  initialState: { isEditFormDirty: false },
  reducers: {
    setEditPage: (state, action) => {
      const { isEditFormDirty } = action.payload;
      state.isEditFormDirty = isEditFormDirty;
    },
  },
});

export const { setEditPage } = EditPageSlice.actions;

export default EditPageSlice.reducer;

export const selectEditPageState = (state) =>
  state.editPageState.isEditFormDirty;

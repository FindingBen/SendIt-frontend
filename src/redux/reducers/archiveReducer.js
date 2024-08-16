import { createSlice } from "@reduxjs/toolkit";

const archiveSlice = createSlice({
  name: "archive_state",
  initialState: { archived: false },
  reducers: {
    setArchiveState: (state, action) => {
      const { archived } = action.payload;
      state.archived = archived;
    },
  },
});

export const { setArchiveState } = archiveSlice.actions;

export default archiveSlice.reducer;

export const selectArchiveStateState = (state) => state.archiveState.archived;

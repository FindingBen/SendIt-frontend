import { createSlice } from "@reduxjs/toolkit";

const elementSlice = createSlice({
  name: "element_state",
  initialState: { populated: false },
  reducers: {
    setList: (state, action) => {
      const { populated } = action.payload;
      state.populated = populated;
    },
  },
});

export const { setList } = elementSlice.actions;

export default elementSlice.reducer;

export const selectListState = (state) => state.elementState.populated;

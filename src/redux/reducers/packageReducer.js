import { createSlice } from "@reduxjs/toolkit";

const packageSlice = createSlice({
  name: "package_plan",
  initialState: { package: null },
  reducers: {
    setPackage: (state, action) => {
      const { package_plan } = action.payload;
      return { ...state, package: package_plan };
    },

    cleanPackage: (state, action) => {
      state.package = null;
    },
  },
});

export const { setPackage, cleanPackage } = packageSlice.actions;

export default packageSlice.reducer;

export const selectCurrentPackage = (state) => state.packageState.package;

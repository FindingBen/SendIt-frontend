import { createSlice } from "@reduxjs/toolkit";

const packageSlice = createSlice({
  name: "package_plan",
  initialState: { package: null },
  reducers: {
    setPackage: (state, action) => {
      const { package_plan, sms_count } = action.payload;

      return {
        ...state,
        package: action.payload.package_plan,
        sms_count: action.payload.sms_count,
      };
    },

    cleanPackage: (state, action) => {
      state.package = null;
      state.sms_count = null;
    },
  },
});

export const { setPackage, cleanPackage } = packageSlice.actions;

export default packageSlice.reducer;

export const selectCurrentPackage = (state) => state.packageState;
export const selectCurrentSmsCount = (state) => state.packageState;

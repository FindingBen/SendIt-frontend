import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  package: null, // the package type, like 'Basic package'
  sms_count: null, // number of sms credits
  list_limit: null, // optional, based on your model
  recipients_limit: null, // optional
};

const packageSlice = createSlice({
  name: "package_plan",
  initialState,
  reducers: {
    setPackage: (state, action) => {
      state.package = action.payload.package_plan;
      state.sms_count = action.payload.sms_count;
      state.list_limit = action.payload.list_limit || null;
      state.recipients_limit = action.payload.recipients_limit || null;
    },
    cleanPackage: (state) => {
      state.package = null;
      state.sms_count = null;
      state.list_limit = null;
      state.recipients_limit = null;
    },
  },
});

export const { setPackage, cleanPackage } = packageSlice.actions;
export default packageSlice.reducer;

// Selectors (for use with useSelector)
export const selectCurrentPackage = (state) => state.packageState;
export const selectCurrentSmsCount = (state) => state.packageState.sms_count;

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user_info",
  initialState: {
    first_name: null,
    last_name: null,
    user_type: null,
    username: null,
    custom_email: null,
    shopify_connect: null,
    scheduled_billing: null,
    business_analysis: null,
    archived_state: null,
    product_import:null
  },
  reducers: {
    setUserInfo: (state, action) => {
      const {
        first_name,
        last_name,
        user_type,
        custom_email,
        archived_state,
        shopify_connect,
        business_analysis,
        scheduled_billing,
        username,
        product_import
      } = action.payload;

      if (first_name !== undefined) state.first_name = first_name;
      if (last_name !== undefined) state.last_name = last_name;
      if (custom_email !== undefined) state.custom_email = custom_email;
      if (user_type !== undefined) state.user_type = user_type;
      if (business_analysis !== undefined) state.business_analysis = business_analysis;
      if (product_import !== undefined) state.product_import = product_import;
      if (shopify_connect !== undefined)
        state.shopify_connect = shopify_connect;
      if (username !== undefined) state.username = username;
      if (scheduled_billing !== undefined)
        state.scheduled_billing = scheduled_billing;
      if (archived_state !== undefined) state.archived_state = archived_state;
    },

    cleanUser: (state) => {
      state.first_name = null;
      state.last_name = null;
      state.user_type = null;
      state.username = null;
      state.custom_email = null;
      state.shopify_connect = null;
      state.business_analysis = null;
      state.archived_state = null;
      state.scheduled_billing = null;
      state.product_import = null;
    },
  },
});

export const { setUserInfo, cleanUser } = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUserState = (state) => state.user;

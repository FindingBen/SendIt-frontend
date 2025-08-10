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
    archived_state: null, // Assuming archived_state is a new addition
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
        scheduled_billing,
        username,
      } = action.payload;
      console.log(action.payload);
      if (first_name !== undefined) state.first_name = first_name;
      if (last_name !== undefined) state.last_name = last_name;
      if (custom_email !== undefined) state.custom_email = custom_email;
      if (user_type !== undefined) state.user_type = user_type;
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
      state.archived_state = null;
      state.scheduled_billing = null;
    },
  },
});

export const { setUserInfo, cleanUser } = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUserState = (state) => state.user;

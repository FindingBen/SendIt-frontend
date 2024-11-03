import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user_info",
  initialState: {
    first_name: null,
    last_name: null,
    user_type: null,
    username: null,
    custom_email: null,
    archived_state: null, // Assuming archived_state is a new addition
  },
  reducers: {
    setUserInfo: (state, action) => {
      const { first_name, last_name, user_type, custom_email, archived_state } =
        action.payload;
      console.log(state);
      if (first_name !== undefined) state.first_name = first_name;
      if (last_name !== undefined) state.last_name = last_name;
      if (user_type !== undefined) state.user_type = user_type;
      if (custom_email !== undefined) state.custom_email = custom_email;
      if (archived_state !== undefined) state.archived_state = archived_state;
    },

    cleanUser: (state) => {
      state.first_name = null;
      state.last_name = null;
      state.user_type = null;
      state.username = null;
      state.custom_email = null;

      state.archived_state = null;
    },
  },
});

export const { setUserInfo, cleanUser } = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUserState = (state) => state.user;

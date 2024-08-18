import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user_info",
  initialState: {
    first_name: null,
    last_name: null,
    user_type: null,
    username: null,
    custom_email: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      const { first_name, last_name, user_type, username, custom_email } =
        action.payload;

      return {
        ...state,
        ...action.payload,
      };
    },

    cleanUser: (state, action) => {
      state.user = {
        first_name: null,
        last_name: null,
        user_type: null,
        username: null,
        custom_email: null,
      };
    },
  },
});

export const { setUserInfo, cleanUser } = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUserState = (state) => state.user;

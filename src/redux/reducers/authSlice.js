import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "access",
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access } = action.payload;
      return { ...state, user: user, token: access };
    },
    registerUser: (state, action) => {
      const { username, first_name, last_name, email, password } =
        action.payload;
      return { ...state, username, first_name, last_name, email, password };
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut, registerUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const logUserOut = (initialState) => initialState;

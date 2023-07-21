import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "access",
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access } = action.payload;
      state.user = user;
      state.token = access;
    },
    registerUser: (state, action) => {
      const { username, first_name, last_name, email, password } =
        action.payload;
      console.log(state);
      state.username = username;
      state.first_name = first_name;
      state.last_name = last_name;
      state.email = email;
      state.password = password;
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

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "access",
  initialState: {
    user: null,
    token: null,
    tokenType: null,
    shopifyDomain: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, tokenType } = action.payload;
      console.log("setCredentials called with:", action.payload);
      return { ...state, user: user, token: access, tokenType: tokenType };
    },
    setShopifyCredentials: (state, action) => {
      console.log(action.payload);
      const { token, tokenType, shopifyDomain, user } = action.payload;
      return {
        ...state,
        token: token,
        tokenType: tokenType,
        shopifyDomain: shopifyDomain,
        user: user.id,
      };
    },
    registerUser: (state, action) => {
      const { username, first_name, last_name, email, password } =
        action.payload;
      return { ...state, username, first_name, last_name, email, password };
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      state.tokenType = null;
    },
  },
});

export const { setCredentials, logOut, registerUser, setShopifyCredentials } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const logUserOut = (initialState) => initialState;
export const selectTokenType = (state) => state.auth.tokenType;
export const selectCurrentDomain = (state) => state.auth.shopifyDomain;

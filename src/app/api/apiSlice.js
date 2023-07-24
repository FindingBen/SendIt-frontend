import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://sendperplane.onrender.com/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization:", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Access token expired, try to refresh it
    console.log("Sending refresh token");
    const refreshResult = await baseQuery(
      "api/token/refresh/",
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const user = api.getState().auth.user;
      // Store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // Retry the original query with the new access token

      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh t  oken failed or expired, log out the user

      api.dispatch(logOut());
      localStorage.removeItem("tokens");
    }
    console.log(result);
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});

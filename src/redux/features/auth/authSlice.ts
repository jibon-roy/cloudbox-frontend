/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type TAuthState = {
  user: null | any;
  subscription: null | any;
  access_token: null | string;
  refresh_token: null | string;
};

const initialState: TAuthState = {
  user: null,
  subscription: null,
  access_token: null,
  refresh_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, subscription, access_token, refresh_token } =
        action.payload;
      state.user = user;
      state.subscription = subscription ?? null;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
    },
    logout: (state) => {
      state.user = null;
      state.subscription = null;
      state.access_token = null;
      state.refresh_token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) =>
  (state.auth as TAuthState).access_token;
export const selectCurrentUser = (state: RootState) =>
  (state.auth as TAuthState).user;
export const selectCurrentSubscription = (state: RootState) =>
  (state.auth as TAuthState).subscription;

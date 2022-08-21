import { createAction, props } from "@ngrx/store";

import { AuthRequestData } from "src/app/services/auth.service";
import { AuthActionTypes } from "./action-types";

interface IAuthenticatePayload {
  email: string;
  userId: string;
  token: string;
  expirationDate: Date,
  redirect: boolean
}

export const authenticateSuccess = createAction(
  AuthActionTypes.AUTHENTICATE_SUCCESS,
  props<IAuthenticatePayload>()
);

export const authFail = createAction(
  AuthActionTypes.AUTHENTICATE_FAIL,
  props<{errorMessage: string}>()
);

export const logout = createAction(
  AuthActionTypes.LOGOUT,
);

export const clearError = createAction(
  AuthActionTypes.CLEAR_ERROR
);

export const loginStart = createAction(
  AuthActionTypes.LOGIN_START,
  props<AuthRequestData>()
);

export const signupStart = createAction(
  AuthActionTypes.SIGNUP_START,
  props<AuthRequestData>()
);

export const autoLogin = createAction(
  AuthActionTypes.AUTO_LOGIN
)
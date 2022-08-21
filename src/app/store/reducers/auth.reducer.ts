import { createReducer, on } from "@ngrx/store";

import { User } from "src/app/models/user.model";
import { updateObject } from "src/app/shared/utility";
import * as Actions from "../actions/auth.actions";

export interface AuthState {
  user: User | null,
  authError: string | null,
  loading: boolean
};

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false
};

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: AuthState,
    action: ReturnType<T>
  ) : AuthState
};

export const authReducer = createReducer(
  initialState,
  on(Actions.authenticateSuccess, (state, action) => authenticateReduce(state, action)),
  on(Actions.logout, (state, action) => logoutReduce(state, action)),
  on(Actions.loginStart, (state, action) => loginStartReduce(state, action)),
  on(Actions.signupStart, (state, action) => signupStartReduce(state, action)),
  on(Actions.authFail, (state, action) => authFailReduce(state, action)),
  on(Actions.clearError, (state, action) => clearErrorReduce(state, action))
)

const authenticateReduce: ReduceFunction<typeof Actions.authenticateSuccess> = 
(state, action) => {
  const user = new User(
    action.email, 
    action.userId,
    action.token,
    action.expirationDate
  );
  return updateObject(state, {
    user: user,
    loading: false
  });
};

const loginStartReduce: ReduceFunction<typeof Actions.loginStart> = 
(state, action) => {
  return updateObject(state, {
    authError: null,
    loading: true
  });
};

const signupStartReduce: ReduceFunction<typeof Actions.signupStart> =
(state, action) => {
  return updateObject(state, {
    authError: null,
    loading: true
  });
};

const authFailReduce: ReduceFunction<typeof Actions.authFail> = 
(state, action) => {
  return updateObject(state, {
    user: null,
    authError: action.errorMessage,
    loading: false
  })
};

const logoutReduce: ReduceFunction<typeof Actions.logout> = 
(state, action) => {
  return updateObject(state, {
    user: null
  });
};

const clearErrorReduce: ReduceFunction<typeof Actions.clearError> =
(state, action) => {
  return updateObject(state, {
    authError: null
  });
};
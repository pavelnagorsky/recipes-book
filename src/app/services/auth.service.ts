import { Injectable } from '@angular/core';

import * as AuthActions from '../store/actions/auth.actions';
import { AppState } from '../store/reducers';

export interface AuthResponseData {
  idToken: string, 	
  email: string,	
  refreshToken: string, 	
  expiresIn: string,
  localId: string,
  registered?: boolean
}

export interface AuthRequestData {
  email: string;
  password: string;
  returnSecureToken: true;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpTimer: NodeJS.Timeout | null;

  constructor(
    private store: AppState
  ) { }

  setLogoutTimer(expirationTime: number) {
    this.tokenExpTimer = setTimeout(
      () => this.store.dispatch(AuthActions.logout()), 
      expirationTime
    )
  } 

  clearExpTimer() {
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

}

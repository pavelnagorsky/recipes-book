import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";

import { Environment } from "src/app/config/env";
import { User, UserDataStorage } from "src/app/models/user.model";
import { 
  AuthRequestData,
  AuthResponseData, 
  AuthService 
} from "src/app/services/auth.service";
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private env: Environment,
    private authService: AuthService
  ) {}

  performSignup = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.signupStart),
      switchMap(authData => {
        return this.handleAuth(authData, 'signUp');
      })
    )
  )

  performLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.loginStart),
      switchMap(authData => {
        return this.handleAuth(authData, 'signInWithPassword');
      })
    )
  );

  performLoginSuccess = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(action => {
        if (action.redirect) {
          this.router.navigate(['/']);
        };
      })
    ), { dispatch: false }
  );

  performAutoLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: UserDataStorage | null = JSON.parse(
          localStorage.getItem('userData') || 'null'
        );
        // геттер класса пользователя проверяет актуальность токена
        if (!userData) return AuthActions.logout();
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          return AuthActions.authenticateSuccess({
            userId: loadedUser.id,
            token: loadedUser.token,
            email: loadedUser.email,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: true
          })
        } else {
          return AuthActions.logout();
        }
      })
    )
  );

  performLogout = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('userData');
        this.router.navigate(['auth'])
      })
    ), { dispatch: false }
  )

  private handleAuth (
    authData: AuthRequestData,
    apiMethod: 'signUp' | 'signInWithPassword'
  ) {
    return this.http
      .post<AuthResponseData>(
        this.env.authBaseUrl + apiMethod + this.env.authKey, 
        authData
      )
      .pipe(
        tap((authResponse => {
          this.authService.setLogoutTimer(
            +authResponse.expiresIn * 1000
          )
        })),
        map(respData => {
          const expirationDate = new Date(
            new Date().getTime() + 
            +respData.expiresIn * 1000
          );
          const user = new User(
            respData.email,
            respData.localId,
            respData.idToken,
            expirationDate
          );
          localStorage.setItem("userData", JSON.stringify(user));
          return AuthActions.authenticateSuccess({
            email: respData.email,
            userId: respData.localId,
            token: respData.idToken,
            expirationDate: expirationDate,
            redirect: true
          });
        }),
        catchError((err: HttpErrorResponse) => {
          return this.errorHandler(err)
        })
      )
  }

  private errorHandler(errorResponse: HttpErrorResponse) {
    let errorMessage = "Network error occured. Please, check your internet connection.";
    if (!errorResponse.error || !errorResponse.error.error) {
      return of(AuthActions.authFail({
        errorMessage: errorMessage
      }));
    };
    switch (errorResponse.error.error.message) {
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND': errorMessage = 'There is no user with this E-mail found. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD': errorMessage = 'The password is invalid.';
        break;
      case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account.';
        break;
      case 'INVALID_EMAIL': errorMessage = 'The email address may be incorrect.';
        break;
      default: errorMessage = "Unknown server error. Please, check your internet connection.";
    }
    return of(AuthActions.authFail({
      errorMessage: errorMessage
    }));
  }

}
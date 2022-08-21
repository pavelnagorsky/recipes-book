import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';

import { AppState } from 'src/app/store/reducers';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private store: AppState
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(state => state.auth.user)
      .pipe(
        take(1),
        exhaustMap(user => {
          if (!user) return next.handle(req);
          req = req.clone({
            params: new HttpParams().set(
              "auth", user?.token || "none"
            )
          });
          return next.handle(req);
        })
      )
  }
}

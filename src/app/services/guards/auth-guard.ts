import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { select } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { AppState } from 'src/app/store/reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: AppState,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> 
  {
    return this.store
      .pipe(
        select(state => state.auth.user),   
        map((user) => {
          const isAuth = !!user;
          if (isAuth) {
            return true
          } else {
            return this.router.createUrlTree(['/auth'])
          }
        }),
        take(1)
      )
  }
}

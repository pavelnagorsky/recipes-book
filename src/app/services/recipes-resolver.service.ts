import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  Resolve, 
  RouterStateSnapshot 
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { map, Observable, of, switchMap, take } from 'rxjs';

import { Recipe } from '../models/recipe.model';
import { fetchRecipes, setRecipes } from '../store/actions/recipe.actions';
import { AppState } from '../store/reducers';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  recipes: Recipe[] = [];

  constructor(
    private store: AppState,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> {
    return this.store
      .pipe(
        select(state => state.recipes.recipes),
        take(1),
        switchMap(recipes => {
          return this.performFetching(recipes)
        })
      )
  }

  private performFetching(recipes: Recipe[]) {
    if (recipes.length > 0) {
      return of(recipes)
    };
    this.store.dispatch(fetchRecipes());
    return this.actions$
      .pipe(
        ofType(setRecipes),
        map(recipes => recipes.recipes),
        take(1)
      )
  }
}

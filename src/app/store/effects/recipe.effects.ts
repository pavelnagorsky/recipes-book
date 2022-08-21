import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { 
  catchError, 
  map, 
  of, 
  switchMap, 
  withLatestFrom 
} from "rxjs";

import { Recipe } from "src/app/models/recipe.model";
import * as RecipeActions from "../actions/recipe.actions";
import { AppState } from "../reducers";

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: AppState
  ) {}

  fetchRecipes = createEffect(() => this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
      switchMap(() => this.http
        .get<Recipe[]>('recipes.json')
      ),
      map(recipes => recipes.map(
        recipe => ({
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        })
      )),
      catchError(err => {
        return of([] as Recipe[]);
      }),
      map(recipes => RecipeActions.setRecipes({ 
        recipes: recipes
      }))
  ));

  storeRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipeActions.saveRecipes),
    withLatestFrom(
      this.store.select(state => state.recipes.recipes)
    ),
    switchMap(([action, recipes]) => this.http
      .put<Recipe[]>("recipes.json", recipes)
    )
  ), {
    dispatch: false
  });
}
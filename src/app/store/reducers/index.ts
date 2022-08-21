import { Injectable } from '@angular/core';
import { ActionReducerMap, Store } from '@ngrx/store';

import { authReducer, AuthState } from './auth.reducer';
import { recipeReducer, RecipeState } from './recipe.reducer';
import { 
  shoppingListReducer, 
  ShoppingListState 
} from './shopping-list.reducer';

export interface IAppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipes: RecipeState;
};

@Injectable({
  providedIn: 'root'
})
export class AppState extends Store<IAppState> {};

export const reducers: ActionReducerMap<IAppState, any> = {
    shoppingList: shoppingListReducer,
    auth: authReducer,
    recipes: recipeReducer
};
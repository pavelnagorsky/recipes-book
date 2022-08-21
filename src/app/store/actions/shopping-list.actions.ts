import { createAction, props } from "@ngrx/store";

import { Ingredient } from "src/app/models/ingredient.model";
import { ShoppingListActionTypes } from "./action-types";

export const addIngredient = createAction(
  ShoppingListActionTypes.ADD_INGREDIENT,
  props<{payload: Ingredient}>()
);

export const addIngredients = createAction(
  ShoppingListActionTypes.ADD_INGREDIENTS,
  props<{payload: Ingredient[]}>()
);

export const updateIngredient = createAction(
  ShoppingListActionTypes.UPDATE_INGREDIENT,
  props<{payload: Ingredient}>()
);

export const deleteIngredient = createAction(
  ShoppingListActionTypes.DELETE_INGREDIENT
);

export const startEdit = createAction(
  ShoppingListActionTypes.START_EDIT,
  props<{payload: number}>()
);

export const stopEdit = createAction(
  ShoppingListActionTypes.STOP_EDIT
);
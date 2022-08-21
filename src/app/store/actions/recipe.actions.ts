import { createAction, props } from "@ngrx/store";

import { Recipe } from "src/app/models/recipe.model";
import { RecipeActionTypes } from "./action-types";

export const setRecipes = createAction(
  RecipeActionTypes.SET_RECIPES,
  props<{ recipes: Recipe[] }>()
);

export const fetchRecipes = createAction(
  RecipeActionTypes.FETCH_RECIPES
);

export const addRecipe = createAction(
  RecipeActionTypes.ADD_RECIPE,
  props<{ recipe: Recipe }>()
);

export const updateRecipe = createAction(
  RecipeActionTypes.UPDATE_RECIPE,
  props<{
    recipe: Recipe,
    id: number
  }>()
);

export const deleteRecipe = createAction(
  RecipeActionTypes.DELETE_RECIPE,
  props<{ id: number }>()
);

export const saveRecipes = createAction(
  RecipeActionTypes.SAVE_RECIPES
)
import { createReducer } from "@ngrx/store";
import { on } from "@ngrx/store";

import { Recipe } from "src/app/models/recipe.model";
import { updateObject } from "src/app/shared/utility";
import * as Actions from '../actions/recipe.actions';

export interface RecipeState {
  recipes: Recipe[]
};

const initialState: RecipeState = {
  recipes: []
};

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: RecipeState,
    action: ReturnType<T>
  ) : RecipeState
};

export const recipeReducer = createReducer(
  initialState,
  on(Actions.setRecipes, (state, action) => setRecipesReduce(state, action)),
  on(Actions.addRecipe, (state, action) => addRecipe(state, action)),
  on(Actions.updateRecipe, (state, action) => updateRecipe(state, action)),
  on(Actions.deleteRecipe, (state, action) => deleteRecipe(state, action))
);

const setRecipesReduce: ReduceFunction<typeof Actions.setRecipes> =
(state, action) => {
  return updateObject(state, {
    recipes: [...action.recipes]
  })
};

const addRecipe: ReduceFunction<typeof Actions.addRecipe> =
(state, action) => {
  return updateObject(state, {
    recipes: [action.recipe, ...state.recipes]
  })
};

const updateRecipe: ReduceFunction<typeof Actions.updateRecipe> =
(state, action) => {
  const updatedRecipes = [...state.recipes];
  updatedRecipes[action.id] = action.recipe;
  return updateObject(state, {
    recipes: updatedRecipes
  })
};

const deleteRecipe: ReduceFunction<typeof Actions.deleteRecipe> =
(state, action) => {
  const updatedRecipes = state.recipes.filter(
    (recipe, index) => index !== action.id
  );
  return updateObject(state, {
    recipes: updatedRecipes
  })
};
import { createReducer, on } from "@ngrx/store";

import { Ingredient } from "src/app/models/ingredient.model";
import { updateObject } from "src/app/shared/utility";
import * as Actions from '../actions/shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[],
  editedIngredient: Ingredient | null,
  editedIngredientIndex: number | null
}

const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatos", 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: null
};

export const shoppingListReducer = createReducer(
  initialState,
  on(Actions.addIngredient, (state, action) => addIngredientReduce(state, action)),
  on(Actions.addIngredients, (state, action) => addIngredientsReduce(state, action)),
  on(Actions.updateIngredient, (state, action) => updateIngredientReduce(state, action)),
  on(Actions.deleteIngredient, (state, action) => deleteIngredientReduce(state, action)),
  on(Actions.startEdit, (state, action) => startEditReduce(state, action)),
  on(Actions.stopEdit, (state, action) => stopEditReduce(state, action))
);

// удаление дупликатов по названию ингридиента и суммирование полей amount
const removeDuplicates = (arr: Ingredient[]): Ingredient[] => {
  const result: Ingredient[] = [];
  for (let i = 0; i < arr.length; i++) {
    let duplicateIndex = 0;
    let duplicate: Ingredient | undefined = result.find(
      (ing, index) => {
        if (ing.name.toLowerCase() === arr[i].name.toLowerCase()) {
          duplicateIndex = index;
          return true;
        } else {
          return false
        }
      }
    );
    if (duplicate) {
      result[duplicateIndex].amount += arr[i].amount;
    } else {
      result.push(new Ingredient(arr[i].name, arr[i].amount));
    }
  }
  return result
};

const addIngredientReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.addIngredient>
): ShoppingListState => {
  return updateObject(state, {
    ingredients: removeDuplicates([...state.ingredients, action.payload])
  });
}

const addIngredientsReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.addIngredients>
): ShoppingListState => {
  return updateObject(state, {
    ingredients: removeDuplicates([...state.ingredients, ...action.payload])
  });
};

const updateIngredientReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.updateIngredient>
): ShoppingListState => {
  const newArr = [...state.ingredients];
  if (typeof state.editedIngredientIndex == 'number') {
    newArr[state.editedIngredientIndex] = action.payload;
  };
  return updateObject(state, {
    ingredients: newArr,
    editedIngredient: null,
    editedIngredientIndex: null
  });
}

const deleteIngredientReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.deleteIngredient>
): ShoppingListState => {
  const updatedIngs = [...state.ingredients]
    .filter((_, i) => i !== state.editedIngredientIndex)
  return updateObject(state, {
    ingredients: updatedIngs,
    editedIngredient: null,
    editedIngredientIndex: null
  })
};

const startEditReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.startEdit>
): ShoppingListState => {
  return updateObject(state, {
    editedIngredientIndex: action.payload,
    editedIngredient: { ...state.ingredients[action.payload] }
  })
};

const stopEditReduce = (
  state: ShoppingListState, 
  action: ReturnType<typeof Actions.stopEdit>
): ShoppingListState => {
  return updateObject(state, {
    editedIngredientIndex: null,
    editedIngredient: null
  })
}; 
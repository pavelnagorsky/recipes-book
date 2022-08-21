import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/models/ingredient.model';
import * as SlActions from 'src/app/store/actions/shopping-list.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;

  private editSub: Subscription;
  editMode = false;
  private editingItem: Ingredient;

  constructor(
    private store: AppState
  ) { }

  onSubmit(f: NgForm) {
    const value: Ingredient = f.value;
    const newItem = new Ingredient(
      value.name.trim(),
      value.amount
    );
    if (this.editMode) {
      this.store.dispatch(
        SlActions.updateIngredient({
          payload: newItem
        })
      );
      this.editMode = false;
    } else {
      this.store.dispatch(SlActions.addIngredient({
        payload: newItem
      }));
    };
    this.slForm.reset()
  }

  onClearForm() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(SlActions.stopEdit());
  }

  onDeleteItem() {
    this.store.dispatch(
      SlActions.deleteIngredient()
    );
    this.onClearForm();
  }

  ngOnInit(): void {
    this.editSub = this.store
      .select(state => state.shoppingList)
      .subscribe(shoppingList => {
        if (
          shoppingList.editedIngredientIndex !== null &&
          shoppingList.editedIngredient !== null
        ) {
          this.editMode = true;
          this.editingItem = shoppingList.editedIngredient
          this.slForm.setValue({
            name: this.editingItem.name,
            amount: this.editingItem.amount
          })
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
    this.store.dispatch(SlActions.stopEdit());
  }
}

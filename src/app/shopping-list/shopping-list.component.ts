import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';
import { AppState } from '../store/reducers';
import * as SlActions from '../store/actions/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  public ingredients$: Observable<Ingredient[]>;

  constructor(
    private store: AppState
  ) { }

  onEditItem(index: number) {
    this.store.dispatch(SlActions.startEdit({
      payload: index
    }));
  }

  ngOnInit(): void {
    this.ingredients$ = this.store.select(state => state.shoppingList.ingredients);
  }
}

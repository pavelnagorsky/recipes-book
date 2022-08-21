import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { logout } from '../store/actions/auth.actions';
import * as RecipeActions from '../store/actions/recipe.actions';
import { AppState } from '../store/reducers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private userSub: Subscription;

  constructor(
    private store: AppState
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select(
        state => state.auth.user
      )
      .subscribe(
        user => {
          this.isAuth = !!user;
        }
      );
  }

  onSaveData() {
    this.store.dispatch(RecipeActions.saveRecipes());
  }

  onFetchData() {
    this.store.dispatch(RecipeActions.fetchRecipes());
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppState } from 'src/app/store/reducers';
import { Recipe } from '../../models/recipe.model'

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes$: Observable<Recipe[]>;

  constructor(
    private store: AppState
  ) { }

  ngOnInit(): void {
    this.recipes$ = this.store
      .select(st => st.recipes.recipes);
  }

}

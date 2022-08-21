import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription, switchMap } from 'rxjs';

import { deleteRecipe } from 'src/app/store/actions/recipe.actions';
import { addIngredients } from 'src/app/store/actions/shopping-list.actions';
import { AppState } from 'src/app/store/reducers';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe | undefined;
  private id: number;
  private recipeSub: Subscription;

  constructor(
    private store: AppState,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.recipeSub = this.route.params.pipe(
      switchMap(params => {
        this.id = +params["id"];
        return this.store
          .select(state => state.recipes.recipes)
      }),
      map(recipes => recipes.find(
        (recipe, index) => index === this.id
      ))
    ).subscribe(
      recipe => this.recipe = recipe
    );
  };

  ngOnDestroy(): void {
    this.recipeSub.unsubscribe();
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({
      id: this.id
    }));
    this.router.navigate(['/recipes']);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {
      relativeTo: this.route
    })
  }

  onAddToShoppingList() {
    if (this.recipe) {
      this.store.dispatch(addIngredients({
        payload: this.recipe.ingredients
      }))
    }
  }

}

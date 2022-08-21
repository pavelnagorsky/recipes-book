import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';

import { Recipe } from 'src/app/models/recipe.model';
import { CustomValidators } from 'src/app/shared/custom-validators';
import * as RecipeActions from 'src/app/store/actions/recipe.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private id: number;
  editMode = false;
  recipe: Recipe;
  recipeForm: FormGroup;
  private recipeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: AppState
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params["id"] != null;
        this.initForm();
      }
    )
  };

  ngOnDestroy(): void {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    )
    if (this.editMode) {
      this.store.dispatch(RecipeActions.updateRecipe({
        recipe: newRecipe,
        id: this.id
      }))
    } else {
      this.store.dispatch(RecipeActions.addRecipe({
        recipe: newRecipe
      }))
    };
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {
      relativeTo: this.route
    })
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, CustomValidators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.recipeSub = this.store
        .select(state => state.recipes.recipes)
        .pipe(
          map(recipes => recipes.find(
            (_, index) => index === this.id
          ))
        )
        .subscribe(recipe => {
          if (!recipe) return;
          this.recipe = recipe;
          recipeName = recipe.name;
          recipeImage = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe['ingredients']) {
            for (let ing of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ing.name, CustomValidators.required),
                  'amount': new FormControl(ing.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          };
        });
    };
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, CustomValidators.required),
      'imagePath': new FormControl(recipeImage, CustomValidators.isUrl),
      'description': new FormControl(recipeDescription, CustomValidators.required),
      'ingredients': recipeIngredients
    });
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  // возвращает bolean значение корректности ссылки на изображение в форме
  isValidUrl(field: string): boolean {
    return this.recipeForm.get(field)?.valid ? true : false
  }

  // для правильного отображения bootsrap классов is-valid, is-invalid
  isValid(field: string): string {
    if (this.recipeForm.get(field)) {
      return (
        !this.recipeForm.get(field)?.valid && this.recipeForm.get(field)?.touched) 
          ? 'is-invalid' 
          : this.recipeForm.get(field)?.touched 
            ? 'is-valid' 
            : '';
    } else {
      return ""
    }
  }
}

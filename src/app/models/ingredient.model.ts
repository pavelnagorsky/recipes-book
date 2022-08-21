interface IIngredient {
  name: string,
  amount: number
}

export class Ingredient implements IIngredient {
  constructor(public name:string, public amount: number) {}
}
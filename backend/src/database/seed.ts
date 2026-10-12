import { randomUUID } from 'node:crypto'
import type { RecipeInput } from '../types.ts'
import { db } from './connection.ts'

const seedRecipes: RecipeInput[] = [
  {
    title: 'Spaghetti Aglio e Olio',
    description: 'A quick Italian classic with garlic, olive oil and chili.',
    image: '',
    ingredients: [
      '400 g spaghetti',
      '6 garlic cloves, thinly sliced',
      '80 ml olive oil',
      '1 tsp chili flakes',
      'Fresh parsley',
      'Salt and pepper',
    ],
    steps: [
      'Cook the spaghetti in salted water until al dente.',
      'Gently fry the garlic in olive oil until golden.',
      'Add chili flakes and a splash of pasta water.',
      'Toss the pasta with the oil and chopped parsley.',
    ],
    prepTime: 20,
    servings: 2,
    favorite: false,
  },
  {
    title: 'Creamy Tomato Soup',
    description: 'Comforting roasted tomato soup with a touch of cream.',
    image: '',
    ingredients: [
      '1 kg ripe tomatoes',
      '1 onion',
      '3 garlic cloves',
      '500 ml vegetable stock',
      '100 ml cream',
      'Basil leaves',
    ],
    steps: [
      'Roast the tomatoes, onion and garlic for 30 minutes.',
      'Blend with the stock until smooth.',
      'Stir in the cream and season to taste.',
      'Serve topped with fresh basil.',
    ],
    prepTime: 45,
    servings: 4,
    favorite: false,
  },
  {
    title: 'Avocado Toast',
    description: 'Crispy sourdough topped with smashed avocado and egg.',
    image: '',
    ingredients: [
      '2 slices sourdough bread',
      '1 ripe avocado',
      '2 eggs',
      '1 lemon',
      'Chili flakes',
      'Olive oil',
    ],
    steps: [
      'Toast the bread until golden.',
      'Smash the avocado with lemon juice and salt.',
      'Poach the eggs to your liking.',
      'Spread, top with eggs and chili flakes.',
    ],
    prepTime: 15,
    servings: 1,
    favorite: false,
  },
  {
    title: 'Chicken Teriyaki Bowl',
    description: 'Sticky glazed chicken over rice with steamed greens.',
    image: '',
    ingredients: [
      '500 g chicken thighs',
      '4 tbsp soy sauce',
      '2 tbsp honey',
      '1 tbsp rice vinegar',
      '2 cups rice',
      'Broccoli',
    ],
    steps: [
      'Cook the rice according to the package.',
      'Sear the chicken until browned.',
      'Add soy, honey and vinegar; simmer to glaze.',
      'Serve over rice with steamed broccoli.',
    ],
    prepTime: 30,
    servings: 2,
    favorite: false,
  },
  {
    title: 'Margherita Pizza',
    description: 'Neapolitan-style pizza with tomato, mozzarella and basil.',
    image: '',
    ingredients: [
      '1 pizza dough',
      '200 g tomato passata',
      '250 g mozzarella',
      'Fresh basil',
      'Olive oil',
    ],
    steps: [
      'Preheat the oven with a stone to 250°C.',
      'Spread passata over the stretched dough.',
      'Add torn mozzarella and bake for 8 minutes.',
      'Finish with basil and olive oil.',
    ],
    prepTime: 90,
    servings: 2,
    favorite: false,
  },
  {
    title: 'Berry Smoothie Bowl',
    description: 'Thick blended berries topped with granola and seeds.',
    image: '',
    ingredients: [
      '200 g frozen berries',
      '1 banana',
      '150 ml yogurt',
      'Granola',
      'Chia seeds',
      'Honey',
    ],
    steps: [
      'Blend berries, banana and yogurt until thick.',
      'Pour into a bowl.',
      'Top with granola, chia seeds and honey.',
      'Serve immediately.',
    ],
    prepTime: 10,
    servings: 1,
    favorite: false,
  },
  {
    title: 'Beef Tacos',
    description: 'Spiced beef in warm tortillas with fresh salsa.',
    image: '',
    ingredients: [
      '500 g ground beef',
      '8 tortillas',
      '1 onion',
      '2 tsp taco seasoning',
      'Tomatoes',
      'Lime',
    ],
    steps: [
      'Brown the beef with diced onion.',
      'Stir in the seasoning and a splash of water.',
      'Warm the tortillas.',
      'Fill and top with salsa and lime.',
    ],
    prepTime: 25,
    servings: 4,
    favorite: false,
  },
  {
    title: 'Mushroom Risotto',
    description: 'Creamy arborio rice slow-cooked with mushrooms and parmesan.',
    image: '',
    ingredients: [
      '300 g arborio rice',
      '400 g mushrooms',
      '1 onion',
      '1 l stock',
      '80 g parmesan',
      'Butter',
    ],
    steps: [
      'Sauté the onion and mushrooms in butter.',
      'Add rice and toast for a minute.',
      'Add stock gradually, stirring until absorbed.',
      'Finish with parmesan and butter.',
    ],
    prepTime: 40,
    servings: 3,
    favorite: false,
  },
  {
    title: 'Blueberry Pancakes',
    description: 'Fluffy pancakes loaded with juicy blueberries.',
    image: '',
    ingredients: [
      '200 g flour',
      '2 eggs',
      '250 ml milk',
      '150 g blueberries',
      '1 tsp baking powder',
      'Maple syrup',
    ],
    steps: [
      'Whisk flour, eggs, milk and baking powder.',
      'Fold in the blueberries.',
      'Cook ladles on a hot griddle until golden.',
      'Stack and drizzle with maple syrup.',
    ],
    prepTime: 20,
    servings: 3,
    favorite: false,
  },
]

export function seedIfEmpty(): void {
  const row = db.prepare('SELECT COUNT(*) AS count FROM recipes').get() as unknown as {
    count: number
  }
  if (row.count > 0) {
    return
  }

  const insert = db.prepare(`
    INSERT INTO recipes
      (id, title, description, image, ingredients, steps, prep_time, servings, favorite, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const now = new Date().toISOString()

  for (const recipe of seedRecipes) {
    insert.run(
      randomUUID(),
      recipe.title,
      recipe.description,
      recipe.image,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.steps),
      recipe.prepTime,
      recipe.servings,
      recipe.favorite ? 1 : 0,
      now,
      now,
    )
  }
}

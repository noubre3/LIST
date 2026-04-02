import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Ingredient = {
  name: string
  amount: string
  unit: string
}

export type Recipe = {
  id: string
  title: string
  description: string | null
  ingredients: Ingredient[]
  instructions: string
  photo_url: string | null
  source_url: string | null
  source_type: 'url' | 'photo' | 'manual'
  tags: string[]
  servings: number
  prep_time: number | null
  cook_time: number | null
  created_at: string
}

export type MealPlan = {
  id: string
  recipe_id: string
  planned_date: string
  servings: number
  created_at: string
  recipe?: Recipe
}

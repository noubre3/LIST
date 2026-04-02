import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'node-html-parser'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL is required' })

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RecipeBot/1.0)' },
    })
    const html = await response.text()
    const root = parse(html)

    // Try JSON-LD structured data first (works on most recipe sites)
    const scripts = root.querySelectorAll('script[type="application/ld+json"]')
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent)
        const recipe = findRecipe(data)
        if (recipe) return res.json(normalizeRecipe(recipe))
      } catch {
        continue
      }
    }

    return res.status(422).json({ error: 'Could not extract recipe from this URL. Try another recipe site.' })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch the URL. Make sure it is a valid recipe page.' })
  }
}

function findRecipe(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (obj['@type'] === 'Recipe') return obj
  if (Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph'] as unknown[]) {
      const found = findRecipe(item)
      if (found) return found
    }
  }
  if (Array.isArray(data)) {
    for (const item of data as unknown[]) {
      const found = findRecipe(item)
      if (found) return found
    }
  }
  return null
}

const UNITS = [
  'cups','cup','c',
  'tablespoons','tablespoon','tbsp','tbs',
  'teaspoons','teaspoon','tsp',
  'pounds','pound','lbs','lb',
  'ounces','ounce','oz',
  'grams','gram','g',
  'kilograms','kilogram','kg',
  'milliliters','milliliter','ml',
  'liters','liter','l',
  'cloves','clove',
  'slices','slice',
  'cans','can',
  'packages','package','pkg',
  'pieces','piece',
  'bunches','bunch',
  'heads','head',
  'stalks','stalk',
  'sprigs','sprig',
  'pinch','dash','handful','drop',
  'inch','inches',
]

const UNIT_PATTERN = new RegExp(
  `^(${UNITS.join('|')})\\b`,
  'i'
)

function parseIngredient(raw: string): { name: string; amount: string; unit: string } {
  // Strip parenthetical notes and anything after double parentheses
  const cleaned = raw.replace(/\s*\(.*?\)/g, '').replace(/\s*,.*$/, '').trim()

  // Match leading number (including fractions like 1/2 or 1 1/2)
  const amountMatch = cleaned.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)/)
  const amount = amountMatch ? amountMatch[1].trim() : ''
  const afterAmount = cleaned.slice(amount.length).trim()

  // Match unit
  const unitMatch = afterAmount.match(UNIT_PATTERN)
  const unit = unitMatch ? unitMatch[1].toLowerCase() : ''
  const afterUnit = afterAmount.slice(unit.length).trim()

  // What's left is the name — clean up leading "of"
  const name = afterUnit.replace(/^of\s+/i, '').trim() || raw.trim()

  return { name, amount, unit }
}

function normalizeRecipe(r: Record<string, unknown>) {
  const ingredients = (r.recipeIngredient as string[] || []).map(parseIngredient)

  const instructions = Array.isArray(r.recipeInstructions)
    ? (r.recipeInstructions as Record<string, unknown>[])
        .flatMap((s) => {
          if (typeof s === 'string') return [s]
          // HowToSection contains itemListElement array
          if (s['@type'] === 'HowToSection' && Array.isArray(s.itemListElement)) {
            return (s.itemListElement as Record<string, unknown>[]).map(
              (step) => (typeof step === 'string' ? step : (step.text as string) || '')
            )
          }
          return [(s.text as string) || '']
        })
        .filter(Boolean)
        .join('\n\n')
    : String(r.recipeInstructions || '')

  const image = Array.isArray(r.image)
    ? (r.image[0] as Record<string, unknown>)?.url || r.image[0]
    : typeof r.image === 'object' && r.image !== null
    ? (r.image as Record<string, unknown>).url
    : r.image

  return {
    title: r.name || '',
    description: r.description || '',
    ingredients,
    instructions,
    photo_url: image || null,
    servings: parseInt(String(r.recipeYield || '4')) || 4,
    prep_time: parseDuration(r.prepTime as string),
    cook_time: parseDuration(r.cookTime as string),
    tags: (r.recipeCategory as string[] | string)
      ? [r.recipeCategory].flat().map(String)
      : [],
  }
}

function parseDuration(iso?: string): number | null {
  if (!iso) return null
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return null
  return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0')
}

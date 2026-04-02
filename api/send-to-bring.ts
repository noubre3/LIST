import type { VercelRequest, VercelResponse } from '@vercel/node'
import Bring from 'bring-shopping'

type Ingredient = {
  name: string
  amount: string
  unit: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { ingredients } = req.body as { ingredients: Ingredient[] }
  if (!ingredients?.length) return res.status(400).json({ error: 'No ingredients provided' })

  const email = process.env.BRING_EMAIL
  const password = process.env.BRING_PASSWORD
  const listName = (process.env.BRING_LIST_NAME || 'EATERS').trim()

  if (!email || !password) {
    return res.status(500).json({ error: 'Bring! credentials not configured' })
  }

  try {
    const bring = new Bring({ mail: email, password })
    const loginResult = await bring.login()
    console.log('Login result:', JSON.stringify(loginResult))

    const listsResponse = await bring.loadLists()
    console.log('Lists response:', JSON.stringify(listsResponse))

    const lists = listsResponse.lists
    const list = lists.find((l: { name: string }) =>
      l.name.toLowerCase() === listName.toLowerCase()
    )

    if (!list) {
      const available = lists.map((l: { name: string }) => l.name).join(', ')
      return res.status(404).json({ error: `List "${listName}" not found. Available lists: ${available}` })
    }

    for (const ing of ingredients) {
      const itemName = ing.name.trim()
      if (!itemName) continue
      const spec = [ing.amount, ing.unit].filter(Boolean).join(' ').trim()
      await bring.saveItem(list.listUuid, itemName, spec)
    }

    return res.json({ success: true, count: ingredients.length })
  } catch (err) {
    console.error('Bring error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: `Bring! error: ${message}` })
  }
}

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
  const listName = process.env.BRING_LIST_NAME || 'EATERS'

  if (!email || !password) {
    return res.status(500).json({ error: 'Bring! credentials not configured' })
  }

  try {
    const bring = new Bring({ mail: email, password })
    await bring.login()

    const listsResponse = await bring.loadLists()
    const lists = listsResponse.lists
    const list = lists.find((l: { name: string }) =>
      l.name.toLowerCase() === listName.toLowerCase()
    )

    if (!list) {
      return res.status(404).json({ error: `List "${listName}" not found in your Bring! account` })
    }

    for (const ing of ingredients) {
      const itemName = ing.name.trim()
      if (!itemName) continue
      const spec = [ing.amount, ing.unit].filter(Boolean).join(' ').trim()
      await bring.saveItem(list.listUuid, itemName, spec)
    }

    return res.json({ success: true, count: ingredients.length })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send to Bring!. Check your credentials.' })
  }
}

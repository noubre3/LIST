import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { image } = req.body
  if (!image) return res.status(400).json({ error: 'Image is required' })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the recipe from this image and return a JSON object with exactly this structure:
{
  "title": "Recipe name",
  "description": "Short description or empty string",
  "servings": 4,
  "prep_time": 15,
  "cook_time": 30,
  "ingredients": [
    { "amount": "2", "unit": "cups", "name": "flour" }
  ],
  "instructions": "Step 1 text\\n\\nStep 2 text\\n\\nStep 3 text",
  "tags": ["dinner", "italian"]
}

Rules:
- ingredients: split amount, unit, and name into separate fields. amount and unit can be empty strings if not present.
- instructions: join all steps with double newlines (\\n\\n) between each step
- tags: suggest 2-5 relevant tags based on the recipe (cuisine, meal type, main ingredient, dietary, etc.)
- prep_time and cook_time: in minutes, use null if not mentioned
- Return ONLY the JSON object, no markdown, no explanation.`,
            },
            {
              type: 'image_url',
              image_url: { url: image, detail: 'high' },
            },
          ],
        },
      ],
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content?.trim() || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(422).json({ error: 'Could not parse recipe from image.' })

    const recipe = JSON.parse(jsonMatch[0])
    return res.json(recipe)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to extract recipe from image.' })
  }
}

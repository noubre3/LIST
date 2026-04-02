import { useState } from 'react'
import { supabase, type Recipe } from '../lib/supabase'

type ExtractedRecipe = Omit<Recipe, 'id' | 'created_at' | 'source_type'>

type Props = {
  onClose: () => void
  onSaved: () => void
}

export default function AddFromUrlModal({ onClose, onSaved }: Props) {
  const [url, setUrl] = useState('')
  const [step, setStep] = useState<'input' | 'loading' | 'review'>('input')
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState<ExtractedRecipe | null>(null)
  const [newTag, setNewTag] = useState('')

  async function handleExtract() {
    if (!url.trim()) return
    setStep('loading')
    setError('')
    try {
      const res = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setStep('input')
        return
      }
      setRecipe({ ...data, source_url: url })
      setStep('review')
    } catch {
      setError('Failed to reach the server. Please try again.')
      setStep('input')
    }
  }

  async function handleSave() {
    if (!recipe) return
    const { error } = await supabase.from('recipes').insert({
      ...recipe,
      source_type: 'url',
    })
    if (error) {
      setError('Failed to save recipe. Please try again.')
      return
    }
    onSaved()
    onClose()
  }

  function removeTag(tag: string) {
    if (!recipe) return
    setRecipe({ ...recipe, tags: recipe.tags.filter((t) => t !== tag) })
  }

  function addTag() {
    if (!recipe || !newTag.trim()) return
    const tag = newTag.trim().toLowerCase()
    if (!recipe.tags.includes(tag)) {
      setRecipe({ ...recipe, tags: [...recipe.tags, tag] })
    }
    setNewTag('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="bg-[#2D1468] rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h2 className="text-[#FFCC00] font-['Bayon'] text-2xl m-0">ADD FROM URL</h2>
          <button onClick={onClose} className="text-white hover:text-[#FFCC00] text-2xl bg-transparent border-0 cursor-pointer">✕</button>
        </div>

        <div className="p-6">

          {/* Step: Input */}
          {step === 'input' && (
            <div>
              <p className="text-[#6B6480] font-['Montserrat'] mb-4">
                Paste the URL of any recipe website and we'll extract it automatically.
              </p>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                placeholder="https://www.example.com/recipe/pasta..."
                className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-3 font-['Montserrat'] text-sm outline-none focus:border-[#2D1468] mb-4"
              />
              {error && <p className="text-red-500 font-['Montserrat'] text-sm mb-4">{error}</p>}
              <button
                onClick={handleExtract}
                className="w-full bg-[#CC3399] text-white font-['Montserrat'] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-[#2D1468] transition-colors border-0 cursor-pointer"
              >
                Extract Recipe
              </button>
            </div>
          )}

          {/* Step: Loading */}
          {step === 'loading' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 animate-spin inline-block">🌀</div>
              <p className="text-[#2D1468] font-['Bayon'] text-2xl">EXTRACTING RECIPE...</p>
              <p className="text-[#6B6480] font-['Montserrat'] text-sm mt-2">This takes a few seconds</p>
            </div>
          )}

          {/* Step: Review */}
          {step === 'review' && recipe && (
            <div>
              <p className="text-[#6B6480] font-['Montserrat'] text-sm mb-4">
                Review the extracted recipe and confirm before saving.
              </p>

              {/* Photo */}
              {recipe.photo_url && (
                <img src={recipe.photo_url} alt={recipe.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              )}

              {/* Title */}
              <div className="mb-4">
                <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest block mb-1">Title</label>
                <input
                  value={recipe.title}
                  onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                  className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-2 font-['Montserrat'] outline-none focus:border-[#2D1468]"
                />
              </div>

              {/* Servings */}
              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest block mb-1">Servings</label>
                  <input
                    type="number"
                    value={recipe.servings}
                    onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 4 })}
                    className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-2 font-['Montserrat'] outline-none focus:border-[#2D1468]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest block mb-1">Prep (min)</label>
                  <input
                    type="number"
                    value={recipe.prep_time ?? ''}
                    onChange={(e) => setRecipe({ ...recipe, prep_time: parseInt(e.target.value) || null })}
                    className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-2 font-['Montserrat'] outline-none focus:border-[#2D1468]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest block mb-1">Cook (min)</label>
                  <input
                    type="number"
                    value={recipe.cook_time ?? ''}
                    onChange={(e) => setRecipe({ ...recipe, cook_time: parseInt(e.target.value) || null })}
                    className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-2 font-['Montserrat'] outline-none focus:border-[#2D1468]"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest">
                    Ingredients ({recipe.ingredients.length})
                  </label>
                  <button
                    onClick={() => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { amount: '', unit: '', name: '' }] })}
                    className="text-[#CC3399] font-['Montserrat'] font-bold text-xs bg-transparent border-0 cursor-pointer hover:text-[#2D1468]"
                  >
                    + Add
                  </button>
                </div>
                <div className="bg-[#FFF8F0] rounded-xl p-3 max-h-48 overflow-y-auto">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 py-1 border-b border-[#F0EAF8] last:border-0 items-center">
                      <input
                        value={ing.amount}
                        onChange={(e) => {
                          const updated = [...recipe.ingredients]
                          updated[i] = { ...updated[i], amount: e.target.value }
                          setRecipe({ ...recipe, ingredients: updated })
                        }}
                        placeholder="qty"
                        className="w-12 bg-white border border-[#F0EAF8] rounded-lg px-1 py-0.5 font-['Montserrat'] text-[#CC3399] font-bold text-sm outline-none focus:border-[#CC3399] shrink-0 text-center"
                      />
                      <input
                        value={ing.unit}
                        onChange={(e) => {
                          const updated = [...recipe.ingredients]
                          updated[i] = { ...updated[i], unit: e.target.value }
                          setRecipe({ ...recipe, ingredients: updated })
                        }}
                        placeholder="unit"
                        className="w-16 bg-white border border-[#F0EAF8] rounded-lg px-1 py-0.5 font-['Montserrat'] text-[#FF7A00] text-sm outline-none focus:border-[#FF7A00] shrink-0"
                      />
                      <input
                        value={ing.name}
                        onChange={(e) => {
                          const updated = [...recipe.ingredients]
                          updated[i] = { ...updated[i], name: e.target.value }
                          setRecipe({ ...recipe, ingredients: updated })
                        }}
                        placeholder="ingredient"
                        className="flex-1 bg-white border border-[#F0EAF8] rounded-lg px-2 py-0.5 font-['Montserrat'] text-[#1A1050] text-sm outline-none focus:border-[#2D1468]"
                      />
                      <button
                        onClick={() => setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, j) => j !== i) })}
                        className="text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer text-xs shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest">Instructions</label>
                  <button
                    onClick={() => setRecipe({ ...recipe, instructions: recipe.instructions ? recipe.instructions + '\n\n' : '' })}
                    className="text-[#CC3399] font-['Montserrat'] font-bold text-xs bg-transparent border-0 cursor-pointer hover:text-[#2D1468]"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="bg-[#FFF8F0] rounded-xl p-3 max-h-64 overflow-y-auto">
                  {recipe.instructions
                    ? recipe.instructions.split('\n\n').map((step, i) => (
                        <div key={i} className="flex gap-3 py-2 border-b border-[#F0EAF8] last:border-0 items-start">
                          <span className="bg-[#2D1468] text-[#FFCC00] font-['Bayon'] text-sm w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">{i + 1}</span>
                          <textarea
                            value={step}
                            onChange={(e) => {
                              const steps = recipe.instructions.split('\n\n')
                              steps[i] = e.target.value
                              setRecipe({ ...recipe, instructions: steps.join('\n\n') })
                            }}
                            rows={2}
                            className="flex-1 bg-white border border-[#F0EAF8] rounded-lg px-2 py-1 font-['Montserrat'] text-[#1A1050] text-sm outline-none focus:border-[#2D1468] resize-none"
                          />
                          <button
                            onClick={() => {
                              const steps = recipe.instructions.split('\n\n').filter((_, j) => j !== i)
                              setRecipe({ ...recipe, instructions: steps.join('\n\n') })
                            }}
                            className="text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer text-xs shrink-0 mt-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    : <p className="text-[#6B6480] font-['Montserrat'] text-sm m-0">No instructions extracted.</p>
                  }
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="text-[#2D1468] font-['Montserrat'] font-bold text-xs uppercase tracking-widest block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="bg-[#CC3399] text-white font-['Montserrat'] text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="bg-transparent border-0 text-white cursor-pointer text-xs ml-1 hover:text-[#FFCC00]">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add a tag..."
                    className="flex-1 border-2 border-[#F0EAF8] rounded-full px-4 py-2 font-['Montserrat'] text-sm outline-none focus:border-[#CC3399]"
                  />
                  <button onClick={addTag} className="bg-[#CC3399] text-white font-['Montserrat'] font-bold px-4 py-2 rounded-full border-0 cursor-pointer hover:bg-[#2D1468] transition-colors">
                    +
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 font-['Montserrat'] text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 border-2 border-[#2D1468] text-[#2D1468] font-['Montserrat'] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-[#F0EAF8] transition-colors bg-transparent cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className="flex-2 bg-[#2D1468] text-[#FFCC00] font-['Montserrat'] font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#CC3399] hover:text-white transition-colors border-0 cursor-pointer"
                >
                  Save Recipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

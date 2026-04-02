import { useEffect, useState } from 'react'
import './index.css'
import { supabase, type Recipe } from './lib/supabase'
import AddFromUrlModal from './components/AddFromUrlModal'
import AddFromPhotoModal from './components/AddFromPhotoModal'

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  useEffect(() => {
    loadRecipes()
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    await supabase.from('recipes').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    setDeleteConfirmName('')
    loadRecipes()
  }

  async function loadRecipes() {
    const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
    if (data) setRecipes(data)
  }

  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.title.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Navigation */}
      <nav className="bg-[#2D1468] px-6 py-4 flex items-center justify-between">
        <h1 className="text-[#FFCC00] text-4xl font-['Bayon'] tracking-wide m-0">LIST</h1>
        <div className="flex gap-6 items-center">
          <button className="text-white font-['Montserrat'] font-semibold text-sm uppercase tracking-widest hover:text-[#FFCC00] transition-colors bg-transparent border-0 cursor-pointer">
            Recipes
          </button>
          <button className="text-white font-['Montserrat'] font-semibold text-sm uppercase tracking-widest hover:text-[#FFCC00] transition-colors bg-transparent border-0 cursor-pointer">
            Meal Plan
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#2D1468] px-6 pb-12 pt-8 text-center">
        <h2 className="text-[#FFCC00] text-6xl font-['Bayon'] m-0">YOUR RECIPE BOOK.</h2>
        <h2 className="text-[#CC3399] text-6xl font-['Bayon'] mt-2 mb-6">YOUR WAY.</h2>
        <p className="text-white font-['Montserrat'] text-lg max-w-md mx-auto opacity-80 m-0">
          Store recipes, plan your meals, and send ingredients straight to Bring!
        </p>
      </div>

      {/* Main content */}
      <div className="px-6 py-8 max-w-5xl mx-auto">

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div
            onClick={() => setShowPhotoModal(true)}
            className="bg-[#2D1468] rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-3">📷</div>
            <p className="text-[#FFCC00] font-['Bayon'] text-xl m-0">FROM PHOTO</p>
            <p className="text-white font-['Montserrat'] text-sm opacity-70 mt-1 m-0">Snap a paper recipe</p>
          </div>
          <div
            onClick={() => setShowUrlModal(true)}
            className="bg-[#CC3399] rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-white font-['Bayon'] text-xl m-0">FROM URL</p>
            <p className="text-white font-['Montserrat'] text-sm opacity-80 mt-1 m-0">Paste a website link</p>
          </div>
          <div className="bg-[#FF7A00] rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-white font-['Bayon'] text-xl m-0">MEAL PLAN</p>
            <p className="text-white font-['Montserrat'] text-sm opacity-80 mt-1 m-0">Plan your week</p>
          </div>
        </div>

        {/* Recipe library header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#2D1468] text-3xl font-['Bayon'] m-0">
            YOUR RECIPES {recipes.length > 0 && <span className="text-[#CC3399]">({recipes.length})</span>}
          </h3>
          <div className="bg-[#F0EAF8] rounded-full px-4 py-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ingredient or name..."
              className="bg-transparent font-['Montserrat'] text-sm text-[#1A1050] outline-none w-64"
            />
          </div>
        </div>

        {/* Recipe grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl shadow-sm border border-[#F0EAF8] overflow-hidden hover:shadow-md transition-shadow relative group">
                {recipe.photo_url ? (
                  <img src={recipe.photo_url} alt={recipe.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-[#F0EAF8] flex items-center justify-center text-4xl">🍽️</div>
                )}
                <button
                  onClick={() => { setDeleteTarget(recipe); setDeleteConfirmName('') }}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold"
                  title="Delete recipe"
                >
                  ✕
                </button>
                <div className="p-4">
                  <h4 className="text-[#2D1468] font-['Bayon'] text-xl m-0 mb-2 leading-tight">{recipe.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-[#CC3399] text-white font-['Montserrat'] text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#6B6480] font-['Montserrat'] text-xs m-0">
                    {recipe.servings} servings
                    {recipe.prep_time ? ` · ${recipe.prep_time}min prep` : ''}
                    {recipe.cook_time ? ` · ${recipe.cook_time}min cook` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#F0EAF8]">
            <div className="text-7xl mb-4">🍴</div>
            <h3 className="text-[#2D1468] font-['Bayon'] text-3xl mb-2 m-0">
              {search ? 'NO RECIPES FOUND' : 'NO RECIPES YET'}
            </h3>
            <p className="text-[#6B6480] font-['Montserrat'] mb-6 mt-2">
              {search ? `Nothing matches "${search}". Try a different search.` : 'Add your first recipe from a photo or a URL to get started.'}
            </p>
            {!search && (
              <button
                onClick={() => setShowUrlModal(true)}
                className="bg-[#2D1468] text-[#FFCC00] font-['Montserrat'] font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#CC3399] hover:text-white transition-colors border-0 cursor-pointer"
              >
                + Add Your First Recipe
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPhotoModal && (
        <AddFromPhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSaved={loadRecipes}
        />
      )}
      {showUrlModal && (
        <AddFromUrlModal
          onClose={() => setShowUrlModal(false)}
          onSaved={loadRecipes}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-red-500 px-6 py-4">
              <h2 className="text-white font-['Bayon'] text-2xl m-0">DELETE RECIPE</h2>
            </div>
            <div className="p-6">
              <p className="text-[#1A1050] font-['Montserrat'] mb-2">
                You are about to delete <strong>"{deleteTarget.title}"</strong>. This cannot be undone.
              </p>
              <p className="text-[#6B6480] font-['Montserrat'] text-sm mb-4">
                Type the recipe name to confirm:
              </p>
              <input
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder={deleteTarget.title}
                className="w-full border-2 border-[#F0EAF8] rounded-xl px-4 py-2 font-['Montserrat'] outline-none focus:border-red-400 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteConfirmName('') }}
                  className="flex-1 border-2 border-[#2D1468] text-[#2D1468] font-['Montserrat'] font-bold uppercase tracking-widest py-3 rounded-full bg-transparent cursor-pointer hover:bg-[#F0EAF8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmName.trim().toLowerCase() !== deleteTarget.title.trim().toLowerCase()}
                  className="flex-1 bg-red-500 text-white font-['Montserrat'] font-bold uppercase tracking-widest py-3 rounded-full border-0 cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

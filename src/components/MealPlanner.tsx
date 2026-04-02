import { useEffect, useState } from 'react'
import { supabase, type MealPlan, type MealType, type Recipe } from '../lib/supabase'

type Props = {
  recipes: Recipe[]
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner' }
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(offset: number): Date[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function MealPlanner({ recipes }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [picker, setPicker] = useState<{ date: string; mealType: MealType } | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const days = getWeekDates(weekOffset)

  useEffect(() => {
    loadMealPlans()
  }, [weekOffset])

  async function loadMealPlans() {
    const start = formatDate(days[0])
    const end = formatDate(days[6])
    const { data } = await supabase
      .from('meal_plans')
      .select('*, recipe:recipes(*)')
      .gte('planned_date', start)
      .lte('planned_date', end)
    if (data) setMealPlans(data)
  }

  async function assignRecipe(recipe: Recipe) {
    if (!picker) return
    // Remove existing meal in that slot first
    await supabase
      .from('meal_plans')
      .delete()
      .eq('planned_date', picker.date)
      .eq('meal_type', picker.mealType)

    await supabase.from('meal_plans').insert({
      recipe_id: recipe.id,
      planned_date: picker.date,
      meal_type: picker.mealType,
      servings: recipe.servings,
    })
    setPicker(null)
    setSearch('')
    loadMealPlans()
  }

  async function removeMeal(id: string) {
    await supabase.from('meal_plans').delete().eq('id', id)
    loadMealPlans()
  }

  function getMeal(date: string, mealType: MealType): MealPlan | undefined {
    return mealPlans.find((m) => m.planned_date === date && m.meal_type === mealType)
  }

  function toggleDay(date: string) {
    setSelectedDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    )
  }

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const today = formatDate(new Date())

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#2D1468] font-['Bayon'] text-3xl m-0">MEAL PLANNER</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="bg-[#F0EAF8] text-[#2D1468] w-10 h-10 rounded-full border-0 cursor-pointer hover:bg-[#2D1468] hover:text-[#FFCC00] transition-colors font-bold text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="text-[#6B6480] font-['Montserrat'] text-sm bg-transparent border-0 cursor-pointer hover:text-[#2D1468]"
          >
            This week
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="bg-[#F0EAF8] text-[#2D1468] w-10 h-10 rounded-full border-0 cursor-pointer hover:bg-[#2D1468] hover:text-[#FFCC00] transition-colors font-bold text-lg"
          >
            ›
          </button>
        </div>
      </div>

      {/* Week range label */}
      <p className="text-[#6B6480] font-['Montserrat'] text-sm mb-4 m-0">
        {days[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} –{' '}
        {days[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">

          {/* Day headers */}
          {days.map((day) => {
            const dateStr = formatDate(day)
            const isToday = dateStr === today
            const isSelected = selectedDays.includes(dateStr)
            return (
              <div
                key={dateStr}
                onClick={() => toggleDay(dateStr)}
                className={`text-center py-2 rounded-xl cursor-pointer transition-colors select-none ${
                  isSelected
                    ? 'bg-[#FFCC00] text-[#2D1468]'
                    : isToday
                    ? 'bg-[#2D1468] text-[#FFCC00]'
                    : 'bg-[#F0EAF8] text-[#2D1468] hover:bg-[#e0d8f0]'
                }`}
              >
                <p className="font-['Montserrat'] font-bold text-xs m-0">{DAY_NAMES[day.getDay()]}</p>
                <p className="font-['Bayon'] text-lg m-0">{day.getDate()}</p>
              </div>
            )
          })}

          {/* Meal rows */}
          {MEAL_TYPES.map((mealType) =>
            days.map((day) => {
              const dateStr = formatDate(day)
              const meal = getMeal(dateStr, mealType)
              return (
                <div key={`${dateStr}-${mealType}`} className="min-h-[90px]">
                  {/* Meal type label — only show in first column */}
                  {day === days[0] && (
                    <p className="text-[#6B6480] font-['Montserrat'] text-xs mb-1 m-0">{MEAL_LABELS[mealType]}</p>
                  )}
                  {day !== days[0] && <div className="h-4" />}

                  {meal ? (
                    <div className="bg-white rounded-xl p-2 border border-[#F0EAF8] shadow-sm group relative">
                      {meal.recipe?.photo_url && (
                        <img src={meal.recipe.photo_url} alt="" className="w-full h-12 object-cover rounded-lg mb-1" />
                      )}
                      <p className="text-[#2D1468] font-['Montserrat'] font-bold text-xs m-0 leading-tight line-clamp-2">
                        {meal.recipe?.title}
                      </p>
                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="absolute top-1 right-1 bg-red-400 text-white w-5 h-5 rounded-full border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPicker({ date: dateStr, mealType })}
                      className="w-full min-h-[60px] border-2 border-dashed border-[#E0D8F0] rounded-xl text-[#CC3399] text-lg bg-transparent cursor-pointer hover:border-[#CC3399] hover:bg-[#FFF0F8] transition-colors"
                    >
                      +
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Meal type labels on the side — visible legend */}
      <div className="mt-4 flex gap-4">
        {MEAL_TYPES.map((m) => (
          <span key={m} className="text-[#6B6480] font-['Montserrat'] text-xs">{MEAL_LABELS[m]}</span>
        ))}
      </div>

      {/* Send to Bring! */}
      {selectedDays.length > 0 && (
        <div className="mt-6 bg-[#2D1468] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[#FFCC00] font-['Bayon'] text-xl m-0">
              {selectedDays.length} DAY{selectedDays.length > 1 ? 'S' : ''} SELECTED
            </p>
            <p className="text-white font-['Montserrat'] text-sm opacity-70 m-0">
              {mealPlans.filter((m) => selectedDays.includes(m.planned_date)).length} meals planned
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDays([])}
              className="border-2 border-white text-white font-['Montserrat'] font-bold text-sm px-4 py-2 rounded-full bg-transparent cursor-pointer hover:bg-white hover:text-[#2D1468] transition-colors"
            >
              Clear
            </button>
            <button
              className="bg-[#FFCC00] text-[#2D1468] font-['Montserrat'] font-bold text-sm px-5 py-2 rounded-full border-0 cursor-pointer hover:bg-[#FF7A00] hover:text-white transition-colors"
            >
              Send to Bring! →
            </button>
          </div>
        </div>
      )}

      {/* Recipe picker modal */}
      {picker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#2D1468] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-[#FFCC00] font-['Bayon'] text-xl m-0">PICK A RECIPE</h3>
                <p className="text-white font-['Montserrat'] text-xs opacity-70 m-0">
                  {MEAL_LABELS[picker.mealType]} · {new Date(picker.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button onClick={() => { setPicker(null); setSearch('') }} className="text-white hover:text-[#FFCC00] text-2xl bg-transparent border-0 cursor-pointer">✕</button>
            </div>
            <div className="p-4 border-b border-[#F0EAF8]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes..."
                autoFocus
                className="w-full border-2 border-[#F0EAF8] rounded-full px-4 py-2 font-['Montserrat'] text-sm outline-none focus:border-[#2D1468]"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredRecipes.length === 0 ? (
                <p className="text-[#6B6480] font-['Montserrat'] text-sm text-center p-8">No recipes found.</p>
              ) : (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => assignRecipe(recipe)}
                    className="flex items-center gap-3 px-4 py-3 border-b border-[#F0EAF8] cursor-pointer hover:bg-[#FFF8F0] transition-colors"
                  >
                    {recipe.photo_url ? (
                      <img src={recipe.photo_url} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-[#F0EAF8] rounded-lg flex items-center justify-center text-xl shrink-0">🍽️</div>
                    )}
                    <div>
                      <p className="text-[#2D1468] font-['Montserrat'] font-bold text-sm m-0">{recipe.title}</p>
                      <p className="text-[#6B6480] font-['Montserrat'] text-xs m-0">{recipe.servings} servings</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

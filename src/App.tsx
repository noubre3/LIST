import './index.css'

function App() {
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
          <button className="bg-[#FFCC00] text-[#2D1468] font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#FF7A00] hover:text-white transition-colors border-0 cursor-pointer">
            + Add Recipe
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#2D1468] px-6 pb-12 pt-8 text-center">
        <h2 className="text-[#FFCC00] text-6xl font-['Bayon'] mb-3 m-0">YOUR RECIPE BOOK.</h2>
        <h2 className="text-[#CC3399] text-6xl font-['Bayon'] mb-6 mt-2">YOUR WAY.</h2>
        <p className="text-white font-['Montserrat'] text-lg max-w-md mx-auto opacity-80 m-0">
          Store recipes, plan your meals, and send ingredients straight to Bring!
        </p>
      </div>

      {/* Main content */}
      <div className="px-6 py-8 max-w-5xl mx-auto">

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-[#2D1468] rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-[#FFCC00] font-['Bayon'] text-xl m-0">FROM PHOTO</p>
            <p className="text-white font-['Montserrat'] text-sm opacity-70 mt-1 m-0">Snap a paper recipe</p>
          </div>
          <div className="bg-[#CC3399] rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform">
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
          <h3 className="text-[#2D1468] text-3xl font-['Bayon'] m-0">YOUR RECIPES</h3>
          <div className="bg-[#F0EAF8] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search by ingredient or name..."
              className="bg-transparent font-['Montserrat'] text-sm text-[#1A1050] outline-none w-64"
            />
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#F0EAF8]">
          <div className="text-7xl mb-4">🍴</div>
          <h3 className="text-[#2D1468] font-['Bayon'] text-3xl mb-2 m-0">NO RECIPES YET</h3>
          <p className="text-[#6B6480] font-['Montserrat'] mb-6 mt-2">Add your first recipe from a photo or a URL to get started.</p>
          <button className="bg-[#2D1468] text-[#FFCC00] font-['Montserrat'] font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#CC3399] hover:text-white transition-colors border-0 cursor-pointer">
            + Add Your First Recipe
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

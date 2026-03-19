import { useState, useEffect } from 'react'
import { db } from './db'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    const all = await db.recipes.orderBy('createdAt').reverse().toArray()
    setRecipes(all)
  }

  async function handleSave(formData) {
    if (editingRecipe) {
      await db.recipes.update(editingRecipe.id, {
        ...formData,
        updatedAt: new Date(),
      })
    } else {
      await db.recipes.add({
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await loadRecipes()
    setShowForm(false)
    setEditingRecipe(null)
    setSelectedRecipe(null)
  }

  async function handleDelete(recipe) {
    if (!confirm(`Delete "${recipe.name}"?`)) return
    await db.recipes.delete(recipe.id)
    await loadRecipes()
    setSelectedRecipe(null)
  }

  function openAdd() {
    setEditingRecipe(null)
    setShowForm(true)
  }

  function openEdit(recipe) {
    setEditingRecipe(recipe)
    setSelectedRecipe(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingRecipe(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-serif text-lg font-semibold text-stone-900">
              My Recipes
            </span>
          </div>
          <button
            onClick={openAdd}
            className="bg-stone-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors flex items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span>
            Add Recipe
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-2">
              No recipes yet
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              Save your first recipe to get started
            </p>
            <button
              onClick={openAdd}
              className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-700 transition-colors"
            >
              Add your first recipe
            </button>
          </div>
        ) : (
          <>
            <p className="text-stone-400 text-xs mb-4 uppercase tracking-wide font-medium">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => openEdit(selectedRecipe)}
          onDelete={() => handleDelete(selectedRecipe)}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <RecipeForm
          initial={editingRecipe}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

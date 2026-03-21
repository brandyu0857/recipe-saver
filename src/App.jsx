import { useState, useEffect } from 'react'
import { db } from './db'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'
import MenuBuilder from './components/MenuBuilder'
import MenuDetail from './components/MenuDetail'
import FamilyManager from './components/FamilyManager'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [menus, setMenus] = useState([])
  const [families, setFamilies] = useState([])
  const [members, setMembers] = useState([])
  const [tab, setTab] = useState('recipes') // 'recipes' | 'menus' | 'family'
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [showMenuBuilder, setShowMenuBuilder] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [r, m, fam, mem] = await Promise.all([
      db.recipes.getAll(),
      db.menus.getAll(),
      db.families.getAll(),
      db.members.getAll(),
    ])
    setRecipes(r)
    setMenus(m)
    setFamilies(fam)
    setMembers(mem)
  }

  async function handleSave(formData) {
    if (editingRecipe) {
      await db.recipes.update(editingRecipe.id, { ...formData, updatedAt: new Date() })
    } else {
      await db.recipes.add({ ...formData, createdAt: new Date(), updatedAt: new Date() })
    }
    setRecipes(await db.recipes.getAll())
    setShowForm(false)
    setEditingRecipe(null)
    setSelectedRecipe(null)
  }

  async function handleDelete(recipe) {
    if (!confirm(`Delete "${recipe.name}"?`)) return
    await db.recipes.delete(recipe.id)
    setRecipes(await db.recipes.getAll())
    setSelectedRecipe(null)
  }

  async function handleSaveMenu(menuData) {
    await db.menus.add({ ...menuData, createdAt: new Date(), updatedAt: new Date() })
    setMenus(await db.menus.getAll())
    setShowMenuBuilder(false)
    setTab('menus')
  }

  async function handleDeleteMenu(id) {
    await db.menus.delete(id)
    setMenus(await db.menus.getAll())
    setSelectedMenu(null)
  }

  async function handleRenameMenu(id, newName) {
    await db.menus.update(id, { name: newName, updatedAt: new Date() })
    setMenus(await db.menus.getAll())
    setSelectedMenu(prev => prev ? { ...prev, name: newName } : prev)
  }

  async function handleCreateFamily(name) {
    await db.families.add({ name, createdAt: new Date() })
    setFamilies(await db.families.getAll())
  }

  async function handleDeleteFamily(id) {
    await db.members.deleteByFamilyId(id)
    await db.families.delete(id)
    const [fam, mem] = await Promise.all([db.families.getAll(), db.members.getAll()])
    setFamilies(fam)
    setMembers(mem)
  }

  async function handleAddMember(familyId, name, color) {
    await db.members.add({ familyId, name, color, createdAt: new Date() })
    setMembers(await db.members.getAll())
  }

  async function handleDeleteMember(id) {
    await db.members.delete(id)
    setMembers(await db.members.getAll())
  }

  function openAdd() { setEditingRecipe(null); setShowForm(true) }
  function openEdit(recipe) { setEditingRecipe(recipe); setSelectedRecipe(null); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditingRecipe(null) }

  // Compute total recipe count for a menu (personal or family)
  function menuRecipeCount(menu) {
    if (menu.contributions) return menu.contributions.reduce((s, c) => s + c.recipeIds.length, 0)
    return menu.recipeIds?.length || 0
  }

  function menuAllRecipeIds(menu) {
    if (menu.contributions) return menu.contributions.flatMap(c => c.recipeIds)
    return menu.recipeIds ?? []
  }

  const TABS = [
    { key: 'recipes', label: 'Recipes' },
    { key: 'menus', label: 'Menus', badge: menus.length || null },
    { key: 'family', label: 'Family', badge: families.length || null },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-serif text-lg font-semibold text-stone-900">My Recipes</span>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'recipes' && recipes.length > 0 && (
              <button
                onClick={() => setShowMenuBuilder(true)}
                className="border border-stone-200 text-stone-700 text-sm font-medium px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                <span className="text-base leading-none">🍽️</span>
                Build Menu
              </button>
            )}
            {tab === 'recipes' && (
              <button
                onClick={openAdd}
                className="bg-stone-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors flex items-center gap-1.5"
              >
                <span className="text-base leading-none">+</span>
                Add Recipe
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex border-t border-stone-100">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                tab === t.key
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {t.label}
              {t.badge ? (
                <span className="bg-stone-100 text-stone-500 text-xs px-1.5 py-0.5 rounded-full">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Recipes tab ── */}
        {tab === 'recipes' && (
          recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🍳</div>
              <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-2">No recipes yet</h2>
              <p className="text-stone-400 text-sm mb-6">Save your first recipe to get started</p>
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
                  <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                ))}
              </div>
            </>
          )
        )}

        {/* ── Menus tab ── */}
        {tab === 'menus' && (
          menus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-2">No menus yet</h2>
              <p className="text-stone-400 text-sm mb-6">Build a menu from your saved recipes</p>
              <button
                onClick={() => { setTab('recipes'); setShowMenuBuilder(true) }}
                className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-700 transition-colors"
              >
                Build your first menu
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-stone-400 text-xs uppercase tracking-wide font-medium">
                  {menus.length} {menus.length === 1 ? 'menu' : 'menus'}
                </p>
                <button
                  onClick={() => { setTab('recipes'); setShowMenuBuilder(true) }}
                  className="text-xs text-stone-600 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1"
                >
                  <span>+</span> New Menu
                </button>
              </div>
              <div className="space-y-3">
                {menus.map(menu => {
                  const count = menuRecipeCount(menu)
                  const allIds = menuAllRecipeIds(menu)
                  const previews = recipes.filter(r => allIds.includes(r.id)).slice(0, 3)
                  const isFamily = Boolean(menu.contributions)
                  return (
                    <button
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left flex items-center gap-4"
                    >
                      <div className="flex -space-x-2 shrink-0">
                        {previews.map(r => (
                          <div key={r.id} className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border-2 border-white">
                            {r.photo
                              ? <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-sm">🍽️</div>
                            }
                          </div>
                        ))}
                        {previews.length === 0 && (
                          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm">🍽️</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-semibold text-stone-900 truncate">{menu.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {isFamily && (
                            <span className="text-xs text-stone-400">👨‍👩‍👧‍👦 {menu.familyName ?? 'Family'} ·</span>
                          )}
                          <span className="text-stone-400 text-xs">{count} {count === 1 ? 'recipe' : 'recipes'}</span>
                        </div>
                      </div>
                      <span className="text-stone-300 text-lg">›</span>
                    </button>
                  )
                })}
              </div>
            </>
          )
        )}

        {/* ── Family tab ── */}
        {tab === 'family' && (
          <FamilyManager
            families={families}
            members={members}
            onCreateFamily={handleCreateFamily}
            onDeleteFamily={handleDeleteFamily}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => openEdit(selectedRecipe)}
          onDelete={() => handleDelete(selectedRecipe)}
        />
      )}

      {/* Recipe Form Modal */}
      {showForm && (
        <RecipeForm initial={editingRecipe} onSave={handleSave} onClose={closeForm} />
      )}

      {/* Menu Builder Modal */}
      {showMenuBuilder && (
        <MenuBuilder
          recipes={recipes}
          families={families}
          members={members}
          onSave={handleSaveMenu}
          onClose={() => setShowMenuBuilder(false)}
        />
      )}

      {/* Menu Detail Modal */}
      {selectedMenu && (
        <MenuDetail
          menu={selectedMenu}
          recipes={recipes}
          onClose={() => setSelectedMenu(null)}
          onDelete={handleDeleteMenu}
          onRename={handleRenameMenu}
        />
      )}
    </div>
  )
}

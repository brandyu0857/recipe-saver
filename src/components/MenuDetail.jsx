import { useState } from 'react'
import { MemberAvatar } from './FamilyManager'

function RecipeItem({ recipe }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
        {recipe.photo
          ? <img src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
        }
      </div>
      <div className="min-w-0">
        <p className="font-serif font-semibold text-stone-900 text-sm truncate">{recipe.name}</p>
        {recipe.description && (
          <p className="text-stone-400 text-xs line-clamp-1">{recipe.description}</p>
        )}
        <p className="text-stone-400 text-xs mt-0.5">
          {recipe.ingredients?.length || 0} ingredients
        </p>
      </div>
    </div>
  )
}

export default function MenuDetail({ menu, recipes, onClose, onDelete, onRename }) {
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(menu.name)

  const isFamily = Boolean(menu.contributions)

  // Flat list for personal menus
  const personalRecipes = isFamily ? [] : recipes.filter(r => menu.recipeIds?.includes(r.id))

  // Total count
  const totalCount = isFamily
    ? menu.contributions.reduce((s, c) => s + c.recipeIds.length, 0)
    : personalRecipes.length

  function handleRename() {
    if (newName.trim() && newName.trim() !== menu.name) onRename(menu.id, newName.trim())
    setRenaming(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-stone-100">
          <div className="flex-1 min-w-0 mr-3">
            {renaming ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false) }}
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-serif font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
                <button onClick={handleRename} className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-lg">Save</button>
                <button onClick={() => { setRenaming(false); setNewName(menu.name) }} className="text-xs text-stone-400 px-2 py-1.5">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold text-stone-900 truncate">{menu.name}</h2>
                <button
                  onClick={() => setRenaming(true)}
                  className="text-stone-400 hover:text-stone-600 text-xs border border-stone-200 px-2 py-0.5 rounded-md shrink-0"
                >
                  Rename
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              {isFamily && (
                <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  👨‍👩‍👧‍👦 {menu.familyName ?? 'Family'}
                </span>
              )}
              <p className="text-stone-400 text-xs">
                {totalCount} {totalCount === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none p-1">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Personal menu: flat list */}
          {!isFamily && (
            personalRecipes.length === 0
              ? <p className="text-stone-400 text-sm text-center py-8">No recipes found.</p>
              : <div className="space-y-3">
                  {personalRecipes.map(r => <RecipeItem key={r.id} recipe={r} />)}
                </div>
          )}

          {/* Family menu: grouped by member */}
          {isFamily && (
            menu.contributions.length === 0
              ? <p className="text-stone-400 text-sm text-center py-8">No contributions yet.</p>
              : menu.contributions.map(contrib => {
                  const contribRecipes = recipes.filter(r => contrib.recipeIds.includes(r.id))
                  return (
                    <div key={contrib.memberId}>
                      {/* Member heading */}
                      <div className="flex items-center gap-2 mb-2">
                        <MemberAvatar
                          member={{ name: contrib.memberName, color: contrib.memberColor }}
                          size="sm"
                        />
                        <span className="text-sm font-semibold text-stone-800">{contrib.memberName}</span>
                        <span className="text-stone-400 text-xs ml-auto">
                          {contribRecipes.length} {contribRecipes.length === 1 ? 'recipe' : 'recipes'}
                        </span>
                      </div>
                      <div className="space-y-2 pl-9">
                        {contribRecipes.length === 0
                          ? <p className="text-stone-400 text-xs">No recipes.</p>
                          : contribRecipes.map(r => <RecipeItem key={r.id} recipe={r} />)
                        }
                      </div>
                    </div>
                  )
                })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-4 border-t border-stone-100">
          <button
            onClick={() => { if (confirm(`Delete menu "${menu.name}"?`)) onDelete(menu.id) }}
            className="w-full border border-red-200 text-red-500 text-sm font-medium py-2.5 rounded-xl hover:bg-red-50 transition-colors"
          >
            Delete Menu
          </button>
        </div>
      </div>
    </div>
  )
}

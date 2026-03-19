import { useState } from 'react'

export default function MenuBuilder({ recipes, onSave, onClose }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [menuName, setMenuName] = useState('')
  const [nameError, setNameError] = useState('')

  function toggleRecipe(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleSave() {
    if (!menuName.trim()) {
      setNameError('Menu name is required')
      return
    }
    if (selectedIds.length === 0) {
      setNameError('Select at least one recipe')
      return
    }
    onSave({ name: menuName.trim(), recipeIds: selectedIds })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">Build a Menu</h2>
            <p className="text-stone-400 text-xs mt-0.5">Select recipes to include</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none p-1">×</button>
        </div>

        {/* Recipe selection */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {recipes.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-8">No recipes yet. Add some recipes first.</p>
          )}
          {recipes.map(recipe => {
            const selected = selectedIds.includes(recipe.id)
            return (
              <button
                key={recipe.id}
                onClick={() => toggleRecipe(recipe.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selected
                    ? 'border-stone-900 bg-stone-50'
                    : 'border-stone-100 bg-white hover:border-stone-200'
                }`}
              >
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selected ? 'bg-stone-900 border-stone-900' : 'border-stone-300'
                }`}>
                  {selected && <span className="text-white text-xs leading-none">✓</span>}
                </div>

                {/* Photo */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {recipe.photo ? (
                    <img src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 text-sm truncate">{recipe.name}</p>
                  <p className="text-stone-400 text-xs">
                    {recipe.ingredients?.length || 0} ingredients
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer: name + save */}
        <div className="px-5 pb-5 pt-4 border-t border-stone-100 space-y-3">
          <div>
            <input
              type="text"
              placeholder="Menu name (e.g. Sunday Dinner)"
              value={menuName}
              onChange={e => { setMenuName(e.target.value); setNameError('') }}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-600 text-sm font-medium py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-stone-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
            >
              Save Menu ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

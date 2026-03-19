export default function RecipeDetail({ recipe, onEdit, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col">
        {/* Photo */}
        {recipe.photo && (
          <div className="aspect-video rounded-t-2xl overflow-hidden flex-shrink-0">
            <img
              src={recipe.photo}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className={`flex items-start justify-between px-5 py-4 ${recipe.photo ? '' : 'border-b border-stone-100'}`}>
          <h2 className="font-serif text-xl font-semibold text-stone-900 leading-snug pr-4">
            {recipe.name}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 pb-2 space-y-5">
          {recipe.description && (
            <p className="text-stone-600 leading-relaxed text-sm">
              {recipe.description}
            </p>
          )}

          {recipe.ingredients?.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
                Ingredients ({recipe.ingredients.length})
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
                    <span className="text-stone-800 text-sm">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!recipe.description && !recipe.ingredients?.length && (
            <p className="text-stone-400 text-sm italic">No details added yet.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 flex gap-3">
          <button
            onClick={onDelete}
            className="border border-stone-200 text-red-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-4 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors"
          >
            Edit Recipe
          </button>
        </div>
      </div>
    </div>
  )
}

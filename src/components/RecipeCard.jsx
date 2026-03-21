export default function RecipeCard({ recipe, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 text-left w-full group"
    >
      <div className="p-4">
        <h2 className="font-serif text-lg font-semibold text-stone-900 leading-snug mb-1 line-clamp-2">
          {recipe.name}
        </h2>
        {recipe.description && (
          <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed mb-3">
            {recipe.description}
          </p>
        )}
        <div className="flex items-center gap-1 text-stone-400 text-xs">
          <span>🥄</span>
          <span>
            {recipe.ingredients?.length || 0} 种食材
          </span>
        </div>
      </div>
    </button>
  )
}

import { useState } from 'react'
import { MemberAvatar } from './FamilyManager'

function RecipeRow({ recipe, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
        selected ? 'border-stone-900 bg-stone-50' : 'border-stone-100 bg-white hover:border-stone-200'
      }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'bg-stone-900 border-stone-900' : 'border-stone-300'
      }`}>
        {selected && <span className="text-white text-xs leading-none">✓</span>}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-stone-900 text-sm truncate">{recipe.name}</p>
        <p className="text-stone-400 text-xs">{recipe.ingredients?.length || 0} 种食材</p>
      </div>
    </button>
  )
}

export default function MenuBuilder({ recipes, families, members, onSave, onClose }) {
  const [mode, setMode] = useState('personal') // 'personal' | 'family'
  const [selectedFamilyId, setSelectedFamilyId] = useState(families[0]?.id ?? null)
  const [personalIds, setPersonalIds] = useState([])
  // contributions: { [memberId]: Set of recipeIds }
  const [contributions, setContributions] = useState({})
  const [menuName, setMenuName] = useState('')
  const [error, setError] = useState('')

  const selectedFamily = families.find(f => f.id === selectedFamilyId)
  const familyMembers = members.filter(m => m.familyId === selectedFamilyId)

  function togglePersonal(id) {
    setPersonalIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleContribution(memberId, recipeId) {
    setContributions(prev => {
      const current = new Set(prev[memberId] ?? [])
      current.has(recipeId) ? current.delete(recipeId) : current.add(recipeId)
      return { ...prev, [memberId]: current }
    })
  }

  function totalSelected() {
    if (mode === 'personal') return personalIds.length
    return Object.values(contributions).reduce((s, set) => s + set.size, 0)
  }

  function handleSave() {
    if (!menuName.trim()) { setError('菜单名称为必填项'); return }
    if (totalSelected() === 0) { setError('请至少选择一个食谱'); return }

    if (mode === 'personal') {
      onSave({ name: menuName.trim(), recipeIds: personalIds })
    } else {
      const contribArray = familyMembers
        .map(m => ({
          memberId: m.id,
          memberName: m.name,
          memberColor: m.color,
          recipeIds: [...(contributions[m.id] ?? [])],
        }))
        .filter(c => c.recipeIds.length > 0)
      onSave({
        name: menuName.trim(),
        familyId: selectedFamilyId,
        familyName: selectedFamily?.name,
        contributions: contribArray,
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">创建菜单</h2>
            <p className="text-stone-400 text-xs mt-0.5">选择要包含的食谱</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none p-1">×</button>
        </div>

        {/* Mode toggle */}
        {families.length > 0 && (
          <div className="px-5 pt-4 flex gap-2">
            <button
              onClick={() => setMode('personal')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                mode === 'personal' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              个人
            </button>
            <button
              onClick={() => setMode('family')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                mode === 'family' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              家庭
            </button>
          </div>
        )}

        {/* Family selector */}
        {mode === 'family' && families.length > 1 && (
          <div className="px-5 pt-3 flex gap-2 flex-wrap">
            {families.map(f => (
              <button
                key={f.id}
                onClick={() => { setSelectedFamilyId(f.id); setContributions({}) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedFamilyId === f.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Personal mode */}
          {mode === 'personal' && (
            recipes.length === 0
              ? <p className="text-stone-400 text-sm text-center py-8">暂无食谱。</p>
              : recipes.map(r => (
                <RecipeRow
                  key={r.id}
                  recipe={r}
                  selected={personalIds.includes(r.id)}
                  onToggle={() => togglePersonal(r.id)}
                />
              ))
          )}

          {/* Family mode */}
          {mode === 'family' && (
            familyMembers.length === 0
              ? <p className="text-stone-400 text-sm text-center py-8">此家庭暂无成员，请在"家庭"标签页中添加成员。</p>
              : familyMembers.map(member => {
                const memberRecipeIds = contributions[member.id] ?? new Set()
                return (
                  <div key={member.id}>
                    {/* Member header */}
                    <div className="flex items-center gap-2 mb-2">
                      <MemberAvatar member={member} size="sm" />
                      <span className="text-sm font-semibold text-stone-800">{member.name}</span>
                      <span className="text-stone-400 text-xs ml-auto">
                        已选 {memberRecipeIds.size}
                      </span>
                    </div>
                    {/* Recipes for this member */}
                    <div className="space-y-2 pl-9">
                      {recipes.length === 0
                        ? <p className="text-stone-400 text-xs">暂无可用食谱。</p>
                        : recipes.map(r => (
                          <RecipeRow
                            key={r.id}
                            recipe={r}
                            selected={memberRecipeIds.has(r.id)}
                            onToggle={() => toggleContribution(member.id, r.id)}
                          />
                        ))
                      }
                    </div>
                  </div>
                )
              })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-4 border-t border-stone-100 space-y-3">
          <div>
            <input
              type="text"
              placeholder="菜单名称（例：周日晚餐）"
              value={menuName}
              onChange={e => { setMenuName(e.target.value); setError('') }}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-600 text-sm font-medium py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-stone-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
            >
              保存菜单（{totalSelected()}）
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

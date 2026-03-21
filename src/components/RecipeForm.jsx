import { useState } from 'react'

const EMPTY_FORM = { name: '', description: '', ingredients: [] }

export default function RecipeForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)
  const [ingredientInput, setIngredientInput] = useState('')
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function addIngredient() {
    const val = ingredientInput.trim()
    if (!val) return
    set('ingredients', [...(form.ingredients || []), val])
    setIngredientInput('')
  }

  function removeIngredient(index) {
    set('ingredients', form.ingredients.filter((_, i) => i !== index))
  }

  function handleIngredientKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = '食谱名称为必填项'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            {initial ? '编辑食谱' : '新建食谱'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-5 space-y-5">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                食谱名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="例：奶奶的千层面"
                className={`w-full border rounded-lg px-3 py-2.5 text-stone-900 placeholder:text-stone-300 outline-none focus:ring-2 focus:ring-stone-900/10 transition ${
                  errors.name ? 'border-red-300' : 'border-stone-200'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                食材
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={e => setIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKey}
                  placeholder="例：2杯面粉"
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-900 placeholder:text-stone-300 outline-none focus:ring-2 focus:ring-stone-900/10 transition text-sm"
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-stone-900 text-white px-4 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                >
                  添加
                </button>
              </div>

              {form.ingredients?.length > 0 && (
                <ul className="space-y-1.5">
                  {form.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2 group"
                    >
                      <span className="text-stone-400 text-xs">•</span>
                      <span className="flex-1 text-sm text-stone-800">{ing}</span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(i)}
                        className="text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-stone-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-xl font-medium hover:bg-stone-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors"
            >
              {initial ? '保存更改' : '保存食谱'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

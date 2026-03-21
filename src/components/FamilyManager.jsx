import { useState } from 'react'

export const MEMBER_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

function initials(name) {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : name.slice(0, 2)
}

function MemberAvatar({ member, size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-semibold text-white uppercase shrink-0`}
      style={{ backgroundColor: member.color }}
    >
      {initials(member.name)}
    </div>
  )
}

export { MemberAvatar, initials }

export default function FamilyManager({
  families,
  members,
  onCreateFamily,
  onDeleteFamily,
  onAddMember,
  onDeleteMember,
}) {
  const [creatingFamily, setCreatingFamily] = useState(false)
  const [familyName, setFamilyName] = useState('')
  const [addingTo, setAddingTo] = useState(null) // familyId
  const [memberName, setMemberName] = useState('')
  const [memberColor, setMemberColor] = useState(MEMBER_COLORS[0])

  function familyMembers(familyId) {
    return members.filter(m => m.familyId === familyId)
  }

  function nextColor(familyId) {
    const used = familyMembers(familyId).map(m => m.color)
    return MEMBER_COLORS.find(c => !used.includes(c)) ?? MEMBER_COLORS[0]
  }

  function submitFamily(e) {
    e.preventDefault()
    if (!familyName.trim()) return
    onCreateFamily(familyName.trim())
    setFamilyName('')
    setCreatingFamily(false)
  }

  function submitMember(e) {
    e.preventDefault()
    if (!memberName.trim()) return
    onAddMember(addingTo, memberName.trim(), memberColor)
    setMemberName('')
    setMemberColor(nextColor(addingTo))
    setAddingTo(null)
  }

  function startAddMember(familyId) {
    setAddingTo(familyId)
    setMemberName('')
    setMemberColor(nextColor(familyId))
  }

  if (families.length === 0 && !creatingFamily) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
        <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-2">暂无家庭</h2>
        <p className="text-stone-400 text-sm mb-6">
          创建一个家庭，让成员各自贡献共享菜单
        </p>
        <button
          onClick={() => setCreatingFamily(true)}
          className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-700 transition-colors"
        >
          创建第一个家庭
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-stone-400 text-xs uppercase tracking-wide font-medium">
          {families.length} 个家庭
        </p>
        {!creatingFamily && (
          <button
            onClick={() => setCreatingFamily(true)}
            className="text-xs text-stone-600 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1"
          >
            <span>+</span> 新家庭
          </button>
        )}
      </div>

      {/* Create family form */}
      {creatingFamily && (
        <form onSubmit={submitFamily} className="bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-900 space-y-3">
          <p className="text-sm font-medium text-stone-700">新家庭名称</p>
          <input
            autoFocus
            type="text"
            placeholder="例：张氏家族"
            value={familyName}
            onChange={e => setFamilyName(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setCreatingFamily(false); setFamilyName('') }}
              className="flex-1 border border-stone-200 text-stone-600 text-sm py-2 rounded-xl hover:bg-stone-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-stone-900 text-white text-sm py-2 rounded-xl hover:bg-stone-700"
            >
              创建
            </button>
          </div>
        </form>
      )}

      {/* Family cards */}
      {families.map(family => {
        const fMembers = familyMembers(family.id)
        return (
          <div key={family.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Family header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍👩‍👧‍👦</span>
                <span className="font-serif font-semibold text-stone-900">{family.name}</span>
                <span className="text-stone-400 text-xs">· {fMembers.length} 位成员</span>
              </div>
              <button
                onClick={() => { if (confirm(`删除家庭"${family.name}"及其所有成员？`)) onDeleteFamily(family.id) }}
                className="text-stone-300 hover:text-red-400 text-xs transition-colors"
              >
                删除
              </button>
            </div>

            {/* Members list */}
            <div className="px-4 py-3 space-y-2">
              {fMembers.length === 0 && (
                <p className="text-stone-400 text-xs py-1">暂无成员，快来添加！</p>
              )}
              {fMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <MemberAvatar member={member} />
                  <span className="flex-1 text-sm text-stone-800 font-medium">{member.name}</span>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="text-stone-300 hover:text-red-400 text-lg leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add member form */}
              {addingTo === family.id ? (
                <form onSubmit={submitMember} className="pt-2 space-y-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="成员姓名"
                    value={memberName}
                    onChange={e => setMemberName(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                  />
                  {/* Color picker */}
                  <div className="flex gap-1.5 flex-wrap">
                    {MEMBER_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setMemberColor(color)}
                        className={`w-6 h-6 rounded-full transition-transform ${memberColor === color ? 'scale-125 ring-2 ring-offset-1 ring-stone-400' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingTo(null)}
                      className="flex-1 border border-stone-200 text-stone-600 text-xs py-1.5 rounded-lg hover:bg-stone-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-stone-900 text-white text-xs py-1.5 rounded-lg hover:bg-stone-700"
                    >
                      添加成员
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => startAddMember(family.id)}
                  className="w-full flex items-center gap-2 text-stone-400 hover:text-stone-600 text-sm py-1 transition-colors"
                >
                  <span className="w-9 h-9 rounded-full border-2 border-dashed border-stone-200 flex items-center justify-center text-lg leading-none hover:border-stone-400 transition-colors">+</span>
                  <span className="text-sm">添加成员</span>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

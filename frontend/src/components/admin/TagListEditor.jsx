import { useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'

export default function TagListEditor({ label, value = [], onChange }) {
  const [draft, setDraft] = useState('')

  const addItem = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...value, trimmed])
    setDraft('')
  }

  const removeItem = (index) => onChange(value.filter((_, i) => i !== index))

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder="e.g. Unlimited gym access"
          className="w-full rounded-xl border border-secondary/10 bg-white px-4 py-2.5 text-sm text-secondary outline-none focus:border-primary dark:border-white/10 dark:bg-secondary-900 dark:text-white"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-secondary/5 px-3.5 text-sm font-semibold text-secondary hover:bg-secondary/10 dark:bg-white/10 dark:text-white"
        >
          <FiPlus size={14} /> Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {value.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center justify-between rounded-lg bg-secondary/5 px-3 py-2 text-sm text-secondary dark:bg-white/5 dark:text-white"
            >
              {item}
              <button type="button" onClick={() => removeItem(i)} aria-label={`Remove ${item}`} className="text-slate-400 hover:text-red-500">
                <FiX size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

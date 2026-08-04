import { useEffect, useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5


export default function ImageUploadField({ label, value, onChange, required, error }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    if (typeof value === 'string' && value) {
      setPreviewUrl(value)
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const handleFile = (file) => {
    setLocalError('')
    if (!file) {
      onChange(null)
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Only JPG, PNG, or WEBP images are allowed.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`Image must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    onChange(file)
  }

  const displayError = error?.message || localError

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-secondary/10 dark:border-white/10">
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleFile(null)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-950/70 text-white"
            >
              <FiX size={11} />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-secondary/20 text-slate-300 dark:border-white/20">
            <FiUpload size={20} />
          </div>
        )}

        <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-secondary/20 px-4 py-3 text-center text-xs font-medium text-slate-500 transition-colors hover:border-primary hover:text-primary dark:border-white/20 dark:text-slate-400">
          {previewUrl ? 'Replace image' : 'Click to upload'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <p className="mt-1.5 text-xs text-slate-400">JPG, PNG, or WEBP — up to {MAX_SIZE_MB}MB.</p>
      {displayError && <span className="mt-1 block text-xs text-red-500">{displayError}</span>}
    </div>
  )
}

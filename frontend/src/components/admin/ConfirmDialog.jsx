import { FiAlertTriangle } from 'react-icons/fi'
import Modal from './Modal'
import Button from '../ui/Button'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Delete this item?', description, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10">
          <FiAlertTriangle size={20} />
        </span>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description || 'This can\u2019t be undone.'}
        </p>
        <div className="mt-3 flex w-full gap-3">
          <Button type="button" variant="secondary" className="flex-1 !py-2.5 text-sm" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

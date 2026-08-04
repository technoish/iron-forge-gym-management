import { useState } from 'react'
import { FiEye, FiInfo } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { listContactMessages } from '../../services/contactAdminService'
import { formatDateTime } from '../../utils/helpers'

const messagesApi = { list: listContactMessages }

export default function AdminMessages() {
  const table = usePaginatedResource(messagesApi, { ordering: '-created_at' })
  const [selected, setSelected] = useState(null)

  const columns = [
    { key: 'name', header: 'From', className: 'font-medium' },
    { key: 'email', header: 'Email' },
    { key: 'subject', header: 'Subject', render: (row) => row.subject || <span className="text-slate-400">—</span> },
    { key: 'created_at', header: 'Received', render: (row) => formatDateTime(row.created_at) },
    {
      key: 'is_read',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.is_read ? 'bg-slate-100 text-slate-500 dark:bg-white/10' : 'bg-primary/10 text-primary'
          }`}
        >
          {row.is_read ? 'Read' : 'New'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Contact Messages</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Messages submitted through the public Contact form.</p>

      <div className="mb-6 flex items-start gap-2 rounded-xl bg-primary/5 p-4 text-sm text-slate-600 dark:bg-primary/10 dark:text-slate-300">
        <FiInfo size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>This inbox is read-only — the API doesn&apos;t yet expose a way to mark messages read or delete them.</p>
      </div>

      <DataTable
        table={table}
        columns={columns}
        searchPlaceholder="Search messages…"
        emptyTitle="No messages yet"
        emptyMessage="Messages submitted through the Contact page will show up here."
        renderActions={(row) => (
          <button
            type="button"
            onClick={() => setSelected(row)}
            aria-label={`View message from ${row.name}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-secondary/5 hover:text-primary dark:hover:bg-white/5"
          >
            <FiEye size={15} />
          </button>
        )}
      />

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Message Details">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">From</p>
                <p className="mt-0.5 font-medium text-secondary dark:text-white">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Received</p>
                <p className="mt-0.5 font-medium text-secondary dark:text-white">{formatDateTime(selected.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                <p className="mt-0.5 font-medium text-secondary dark:text-white">
                  <a href={`mailto:${selected.email}`} className="hover:text-primary">{selected.email}</a>
                </p>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
                  <p className="mt-0.5 font-medium text-secondary dark:text-white">{selected.phone}</p>
                </div>
              )}
            </div>
            {selected.subject && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subject</p>
                <p className="mt-0.5 font-medium text-secondary dark:text-white">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Message</p>
              <p className="mt-1.5 whitespace-pre-wrap rounded-xl bg-secondary/5 p-4 text-secondary dark:bg-white/5 dark:text-white">
                {selected.message}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

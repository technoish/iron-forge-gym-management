import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import TestimonialForm from '../../components/admin/forms/TestimonialForm'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { useResourceCrud } from '../../hooks/useResourceCrud'
import { testimonialAdminApi } from '../../services/testimonialService'

export default function AdminTestimonials() {
  const table = usePaginatedResource(testimonialAdminApi, { ordering: '-created_at' })
  const crud = useResourceCrud(testimonialAdminApi, { refetch: table.refetch, entityName: 'Testimonial' })

  const columns = [
    { key: 'customer_name', header: 'Customer', className: 'font-medium' },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={13} className={i < row.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'} />
          ))}
        </div>
      ),
    },
    {
      key: 'review',
      header: 'Review',
      className: 'max-w-xs',
      render: (row) => <span className="line-clamp-1 text-slate-500 dark:text-slate-400">{row.review}</span>,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.is_active ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10'
          }`}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Testimonials</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Manage member reviews shown on the public site.</p>

      <DataTable
        table={table}
        columns={columns}
        onCreate={crud.openCreate}
        createLabel="Add Testimonial"
        searchPlaceholder="Search testimonials…"
        emptyTitle="No testimonials yet"
        emptyMessage="Add your first testimonial to get started."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => crud.openEdit(row)} aria-label={`Edit testimonial from ${row.customer_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-secondary/5 hover:text-primary dark:hover:bg-white/5">
              <FiEdit2 size={15} />
            </button>
            <button type="button" onClick={() => crud.setDeleteTarget(row)} aria-label={`Delete testimonial from ${row.customer_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={crud.isFormOpen} onClose={crud.closeForm} title={crud.editingItem ? 'Edit Testimonial' : 'Add Testimonial'}>
        <TestimonialForm
          key={crud.editingItem?.id || 'new'}
          initialValues={crud.editingItem || undefined}
          onSubmit={crud.handleSubmit}
          isSubmitting={crud.isSubmitting}
          formError={crud.formError}
          fieldErrors={crud.fieldErrors}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(crud.deleteTarget)}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={crud.confirmDelete}
        isLoading={crud.isDeleting}
        description={crud.deleteTarget ? `Delete testimonial from ${crud.deleteTarget.customer_name}? This can't be undone.` : ''}
      />
    </div>
  )
}

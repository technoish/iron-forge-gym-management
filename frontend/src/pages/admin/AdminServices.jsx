import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ServiceForm from '../../components/admin/forms/ServiceForm'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { useResourceCrud } from '../../hooks/useResourceCrud'
import { serviceAdminApi } from '../../services/servicesService'

export default function AdminServices() {
  const table = usePaginatedResource(serviceAdminApi, { ordering: 'title' })
  const crud = useResourceCrud(serviceAdminApi, { refetch: table.refetch, entityName: 'Service' })

  const columns = [
    {
      key: 'title',
      header: 'Service',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/5 text-xs font-bold text-slate-400 dark:bg-white/10">
              {row.title?.[0]?.toUpperCase()}
            </span>
          )}
          <span className="font-medium">{row.title}</span>
        </div>
      ),
    },
    { key: 'icon', header: 'Icon' },
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
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Services</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Manage programs shown on the public site.</p>

      <DataTable
        table={table}
        columns={columns}
        onCreate={crud.openCreate}
        createLabel="Add Service"
        searchPlaceholder="Search services…"
        emptyTitle="No services yet"
        emptyMessage="Add your first service to get started."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => crud.openEdit(row)} aria-label={`Edit ${row.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-secondary/5 hover:text-primary dark:hover:bg-white/5">
              <FiEdit2 size={15} />
            </button>
            <button type="button" onClick={() => crud.setDeleteTarget(row)} aria-label={`Delete ${row.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={crud.isFormOpen} onClose={crud.closeForm} title={crud.editingItem ? 'Edit Service' : 'Add Service'}>
        <ServiceForm
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
        description={crud.deleteTarget ? `Delete ${crud.deleteTarget.title}? This can't be undone.` : ''}
      />
    </div>
  )
}

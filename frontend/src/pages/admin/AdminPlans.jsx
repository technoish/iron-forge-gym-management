import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import PlanForm from '../../components/admin/forms/PlanForm'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { useResourceCrud } from '../../hooks/useResourceCrud'
import { planAdminApi } from '../../services/membershipService'

const DURATION_LABEL = { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' }

export default function AdminPlans() {
  const table = usePaginatedResource(planAdminApi, { ordering: 'price' })
  const crud = useResourceCrud(planAdminApi, { refetch: table.refetch, entityName: 'Plan' })

  const columns = [
    {
      key: 'plan_name',
      header: 'Plan',
      render: (row) => (
        <span className="flex items-center gap-1.5 font-medium">
          {row.plan_name}
          {row.is_popular && <FiStar size={13} className="fill-amber-400 text-amber-400" />}
        </span>
      ),
    },
    { key: 'duration', header: 'Duration', render: (row) => DURATION_LABEL[row.duration] || row.duration },
    { key: 'price', header: 'Price', render: (row) => `$${row.price}` },
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
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Membership Plans</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Manage pricing tiers shown on the public site.</p>

      <DataTable
        table={table}
        columns={columns}
        onCreate={crud.openCreate}
        createLabel="Add Plan"
        searchPlaceholder="Search plans…"
        emptyTitle="No plans yet"
        emptyMessage="Add your first membership plan to get started."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => crud.openEdit(row)} aria-label={`Edit ${row.plan_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-secondary/5 hover:text-primary dark:hover:bg-white/5">
              <FiEdit2 size={15} />
            </button>
            <button type="button" onClick={() => crud.setDeleteTarget(row)} aria-label={`Delete ${row.plan_name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={crud.isFormOpen} onClose={crud.closeForm} title={crud.editingItem ? 'Edit Plan' : 'Add Plan'}>
        <PlanForm
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
        description={crud.deleteTarget ? `Delete ${crud.deleteTarget.plan_name}? This can't be undone.` : ''}
      />
    </div>
  )
}

import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import GalleryForm from '../../components/admin/forms/GalleryForm'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { useResourceCrud } from '../../hooks/useResourceCrud'
import { galleryAdminApi } from '../../services/galleryService'

const CATEGORY_LABEL = { floor: 'Gym Floor', classes: 'Classes', equipment: 'Equipment', events: 'Events', facility: 'Facility' }

export default function AdminGallery() {
  const table = usePaginatedResource(galleryAdminApi, { ordering: '-uploaded_at' })
  const crud = useResourceCrud(galleryAdminApi, { refetch: table.refetch, entityName: 'Image' })

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (row) => <img src={row.image} alt={row.title || ''} className="h-12 w-16 rounded-lg object-cover" />,
    },
    { key: 'title', header: 'Title', render: (row) => row.title || <span className="text-slate-400">Untitled</span> },
    { key: 'category', header: 'Category', render: (row) => CATEGORY_LABEL[row.category] || row.category },
  ]

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Gallery</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Manage photos shown on the public site.</p>

      <DataTable
        table={table}
        columns={columns}
        onCreate={crud.openCreate}
        createLabel="Upload Image"
        searchPlaceholder="Search by title…"
        emptyTitle="No images yet"
        emptyMessage="Upload your first gallery image to get started."
        filterSlot={
          <select
            value={table.filters.category || ''}
            onChange={(e) => table.setFilter('category', e.target.value)}
            className="rounded-full border border-secondary/10 bg-white px-3.5 py-2.5 text-sm text-secondary focus:border-primary dark:border-white/10 dark:bg-secondary-900 dark:text-white"
          >
            <option value="">All categories</option>
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        }
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => crud.openEdit(row)} aria-label="Edit image" className="rounded-lg p-2 text-slate-400 hover:bg-secondary/5 hover:text-primary dark:hover:bg-white/5">
              <FiEdit2 size={15} />
            </button>
            <button type="button" onClick={() => crud.setDeleteTarget(row)} aria-label="Delete image" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={crud.isFormOpen} onClose={crud.closeForm} title={crud.editingItem ? 'Edit Image' : 'Upload Image'}>
        <GalleryForm
          key={crud.editingItem?.id || 'new'}
          initialValues={crud.editingItem || undefined}
          isEditing={Boolean(crud.editingItem)}
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
        description="Delete this image? This can't be undone."
      />
    </div>
  )
}

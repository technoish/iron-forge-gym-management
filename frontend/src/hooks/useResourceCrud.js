import { useState } from 'react'
import toast from 'react-hot-toast'


export function useResourceCrud(resourceApi, { refetch, entityName = 'Item' }) {
  const [editingItem, setEditingItem] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const openCreate = () => {
    setEditingItem(null)
    setFormError('')
    setFieldErrors({})
    setIsFormOpen(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setFormError('')
    setFieldErrors({})
    setIsFormOpen(true)
  }

  const closeForm = () => setIsFormOpen(false)

  const handleSubmit = async (payload) => {
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await resourceApi.update(editingItem.id, payload)
        toast.success(`${entityName} updated.`)
      } else {
        await resourceApi.create(payload)
        toast.success(`${entityName} created.`)
      }
      setIsFormOpen(false)
      refetch()
    } catch (err) {
      setFormError(err.message)
      setFieldErrors(err.fieldErrors || {})
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await resourceApi.remove(deleteTarget.id)
      toast.success(`${entityName} deleted.`)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    editingItem,
    isFormOpen,
    isSubmitting,
    formError,
    fieldErrors,
    openCreate,
    openEdit,
    closeForm,
    handleSubmit,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    confirmDelete,
  }
}

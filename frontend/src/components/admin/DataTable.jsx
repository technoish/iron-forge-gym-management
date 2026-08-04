import { FiSearch, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function DataTable({
  table,
  columns,
  renderActions,
  onCreate,
  createLabel = 'Add New',
  filterSlot,
  searchPlaceholder = 'Search…',
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  getRowKey = (row) => row.id,
}) {
  const { items, meta, isLoading, isError, refetch, setPage, search, setSearch } = table

  return (
    <div className="card-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-secondary/10 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-secondary/10 bg-white py-2.5 pl-10 pr-4 text-sm text-secondary placeholder:text-slate-400 focus:border-primary dark:border-white/10 dark:bg-secondary-900 dark:text-white"
            />
          </div>
          {filterSlot}
        </div>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <FiPlus size={15} /> {createLabel}
          </button>
        )}
      </div>

      {/* Body */}
      {isLoading && (
        <div className="space-y-3 p-4" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6">
          <ErrorState compact message="We couldn't load this list." onRetry={refetch} />
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="p-6">
          <EmptyState title={emptyTitle} message={emptyMessage} />
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-secondary/10 text-xs uppercase tracking-wide text-slate-400 dark:border-white/10">
                {columns.map((col) => (
                  <th key={col.key} className={`whitespace-nowrap px-4 py-3 font-semibold ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {renderActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-secondary/5 last:border-0 hover:bg-secondary/[0.03] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-middle text-secondary dark:text-white ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between border-t border-secondary/10 px-4 py-3 text-sm dark:border-white/10">
          <span className="text-slate-400">
            Page {meta.current_page} of {meta.total_pages} · {meta.count} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!meta.previous}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/10 text-slate-500 disabled:opacity-40 dark:border-white/10"
            >
              <FiChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.next}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/10 text-slate-500 disabled:opacity-40 dark:border-white/10"
            >
              <FiChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

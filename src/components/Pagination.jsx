import React from 'react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Pagination
 * Page-size selector + prev/next controls. Kept dumb/presentational -
 * all page math happens in useUsers.
 */
export default function Pagination({ page, totalPages, pageSize, totalResults, onPageChange, onPageSizeChange }) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {page} of {totalPages} ({totalResults} results)
      </div>

      <div className="pagination-controls">
        <label htmlFor="pageSize">Rows per page</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button
          className="btn btn-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

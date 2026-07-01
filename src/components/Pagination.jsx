import React from 'react';
import { ArrowLeft, ArrowRight } from './icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function Pagination({ page, totalPages, pageSize, totalResults, onPageChange, onPageSizeChange }) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        Page {page} of {totalPages} · {totalResults} {totalResults === 1 ? 'result' : 'results'}
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

        <button
          className="btn btn-secondary btn-sm btn-icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ArrowLeft width={14} height={14} />
        </button>
        <button
          className="btn btn-secondary btn-sm btn-icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ArrowRight width={14} height={14} />
        </button>
      </div>
    </div>
  );
}
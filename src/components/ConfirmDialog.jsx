import React from 'react';

/**
 * ConfirmDialog
 * Generic yes/no confirmation modal - used to confirm destructive actions
 * like deleting a user before they happen.
 */
export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true">
      <div className="modal modal-sm">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

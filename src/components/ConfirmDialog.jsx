import React from 'react';

/**
 * ConfirmDialog
 * Generic yes/no confirmation modal - used to confirm actions that need a
 * deliberate second step before happening (deleting a user, resetting demo
 * data, etc). `confirmLabel` lets callers use it for more than just deletes.
 */
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
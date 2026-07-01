import React, { useState } from 'react';

/**
 * FilterPopup
 * Lets the user filter the table by first name, last name, email and
 * department simultaneously. Keeps a local draft of the filters so
 * typing doesn't re-filter the table on every keystroke - the parent
 * state only updates when "Apply" is clicked.
 */
export default function FilterPopup({ filters, onApply, onClear, onClose }) {
  const [draft, setDraft] = useState(filters);

  const handleChange = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft({ firstName: '', lastName: '', email: '', department: '' });
    onClear();
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Filter Users</h2>

        <div className="form-field">
          <label htmlFor="filter-firstName">First Name</label>
          <input id="filter-firstName" value={draft.firstName} onChange={handleChange('firstName')} />
        </div>

        <div className="form-field">
          <label htmlFor="filter-lastName">Last Name</label>
          <input id="filter-lastName" value={draft.lastName} onChange={handleChange('lastName')} />
        </div>

        <div className="form-field">
          <label htmlFor="filter-email">Email</label>
          <input id="filter-email" value={draft.email} onChange={handleChange('email')} />
        </div>

        <div className="form-field">
          <label htmlFor="filter-department">Department</label>
          <input id="filter-department" value={draft.department} onChange={handleChange('department')} />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear Filters
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

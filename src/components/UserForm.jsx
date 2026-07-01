import React, { useState, useEffect } from 'react';
import { validateUserForm } from '../utils/validation';

const EMPTY_USER = { firstName: '', lastName: '', email: '', department: '' };

export default function UserForm({ initialUser, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(initialUser || EMPTY_USER);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialUser);

  useEffect(() => {
    setValues(initialUser || EMPTY_USER);
    setErrors({});
  }, [initialUser]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>{isEditMode ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              value={values.firstName}
              onChange={handleChange('firstName')}
              aria-invalid={Boolean(errors.firstName)}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              value={values.lastName}
              onChange={handleChange('lastName')}
              aria-invalid={Boolean(errors.lastName)}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              value={values.department}
              onChange={handleChange('department')}
              aria-invalid={Boolean(errors.department)}
            />
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

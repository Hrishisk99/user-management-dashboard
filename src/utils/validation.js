const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a user form payload.
 * @param {{firstName: string, lastName: string, email: string, department: string}} values
 * @returns {Object} errors - a map of field -> error message. Empty object means valid.
 */
export function validateUserForm(values) {
  const errors = {};

  if (!values.firstName || !values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName || !values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.department || !values.department.trim()) {
    errors.department = 'Department is required.';
  }

  return errors;
}

/** Convenience helper: true if the form has no validation errors. */
export function isFormValid(values) {
  return Object.keys(validateUserForm(values)).length === 0;
}

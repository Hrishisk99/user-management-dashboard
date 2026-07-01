import { describe, it, expect } from 'vitest';
import { validateUserForm, isFormValid } from '../utils/validation';

describe('validateUserForm', () => {
  const validUser = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    department: 'Engineering',
  };

  it('returns no errors for a fully valid user', () => {
    expect(validateUserForm(validUser)).toEqual({});
  });

  it('flags a missing first name', () => {
    const errors = validateUserForm({ ...validUser, firstName: '' });
    expect(errors.firstName).toBeDefined();
  });

  it('flags a missing last name', () => {
    const errors = validateUserForm({ ...validUser, lastName: '   ' });
    expect(errors.lastName).toBeDefined();
  });

  it('flags an invalid email format', () => {
    const errors = validateUserForm({ ...validUser, email: 'not-an-email' });
    expect(errors.email).toBeDefined();
  });

  it('flags a missing email', () => {
    const errors = validateUserForm({ ...validUser, email: '' });
    expect(errors.email).toBeDefined();
  });

  it('flags a missing department', () => {
    const errors = validateUserForm({ ...validUser, department: '' });
    expect(errors.department).toBeDefined();
  });

  it('accepts common valid email formats', () => {
    ['a@b.co', 'first.last@company.io', 'user+tag@domain.com'].forEach((email) => {
      expect(validateUserForm({ ...validUser, email }).email).toBeUndefined();
    });
  });
});

describe('isFormValid', () => {
  it('returns true when there are no errors', () => {
    expect(
      isFormValid({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', department: 'Eng' })
    ).toBe(true);
  });

  it('returns false when required fields are missing', () => {
    expect(isFormValid({ firstName: '', lastName: '', email: '', department: '' })).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { getDepartmentColor, getInitials } from '../utils/departmentTags';

describe('getDepartmentColor', () => {
  it('returns the same color for the same department every time', () => {
    expect(getDepartmentColor('Engineering')).toEqual(getDepartmentColor('Engineering'));
  });

  it('falls back to a default color when department is empty', () => {
    expect(getDepartmentColor('')).toBeDefined();
    expect(getDepartmentColor(undefined)).toBeDefined();
  });

  it('returns an object with bg and fg color values', () => {
    const color = getDepartmentColor('Sales');
    expect(color).toHaveProperty('bg');
    expect(color).toHaveProperty('fg');
  });
});

describe('getInitials', () => {
  it('combines the first letter of first and last name', () => {
    expect(getInitials('Ada', 'Lovelace')).toBe('AL');
  });

  it('handles a missing last name', () => {
    expect(getInitials('Cher', '')).toBe('C');
  });

  it('falls back to "?" when both names are missing', () => {
    expect(getInitials('', '')).toBe('?');
  });
});
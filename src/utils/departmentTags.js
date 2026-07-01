/**
 * departmentTags.js
 * Deterministically maps a department name to one of a fixed set of
 * accent colors, so the same department always renders with the same
 * tag color across the app (and across reloads) without needing to
 * store a color mapping anywhere.
 */

const PALETTE = [
  { bg: '#e6f4f1', fg: '#0f766e' }, // teal
  { bg: '#eef2ff', fg: '#4338ca' }, // indigo
  { bg: '#fef3e8', fg: '#c2410c' }, // amber
  { bg: '#fdf2f8', fg: '#be185d' }, // pink
  { bg: '#f0fdf4', fg: '#15803d' }, // green
  { bg: '#eff6ff', fg: '#1d4ed8' }, // blue
];

export function getDepartmentColor(department) {
  if (!department) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < department.length; i += 1) {
    hash = (hash << 5) - hash + department.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/** First letters of first + last name, used for the avatar badge. */
export function getInitials(firstName, lastName) {
  const a = (firstName || '').trim()[0] || '';
  const b = (lastName || '').trim()[0] || '';
  return (a + b).toUpperCase() || '?';
}
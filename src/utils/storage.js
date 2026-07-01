/**
 * storage.js
 *
 * JSONPlaceholder is a mock API - it accepts POST/PUT/DELETE and echoes
 * back a "successful" response, but never actually persists anything
 * server-side. A refresh would otherwise wipe out any Add/Edit/Delete the
 * user just did, which looks like a bug even though it's an inherent
 * limitation of the mock API (documented in the README).
 *
 * These helpers cache the current user list in localStorage purely as a
 * display-layer convenience so the app *feels* like a real CRUD app across
 * refreshes. The actual Add/Edit/Delete still go through userService's
 * real fetch calls to JSONPlaceholder first - this only changes what the
 * UI shows afterward, not how data reaches the API.
 */

const STORAGE_KEY = 'umd_users_v1';

/** Returns the cached user list, or null if nothing has been cached yet. */
export function loadStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Caches the given user list. */
export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Non-fatal if this fails.
  }
}

/** Clears the cache, used by "Reset demo data". */
export function clearStoredUsers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-fatal.
  }
}
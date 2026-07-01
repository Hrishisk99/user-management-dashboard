const STORAGE_KEY = 'umd_users_v1';

export function loadStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Non-fatal if this fails.
  }
}

export function clearStoredUsers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-fatal.
  }
}
import { describe, it, expect, beforeEach } from 'vitest';
import { loadStoredUsers, saveStoredUsers, clearStoredUsers } from '../utils/storage';

const SAMPLE = [{ id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', department: 'Engineering' }];

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing has been cached', () => {
    expect(loadStoredUsers()).toBeNull();
  });

  it('round-trips a user list through save and load', () => {
    saveStoredUsers(SAMPLE);
    expect(loadStoredUsers()).toEqual(SAMPLE);
  });

  it('clearStoredUsers removes the cached list', () => {
    saveStoredUsers(SAMPLE);
    clearStoredUsers();
    expect(loadStoredUsers()).toBeNull();
  });

  it('loadStoredUsers returns null for corrupted JSON instead of throwing', () => {
    localStorage.setItem('umd_users_v1', '{not valid json');
    expect(loadStoredUsers()).toBeNull();
  });
});
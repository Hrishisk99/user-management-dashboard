import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUsers, createUser, deleteUser, mapUserFromApi, mapUserToApi } from '../services/userService';

describe('mapUserFromApi', () => {
  it('splits name into firstName/lastName and pulls company as department', () => {
    const apiUser = { id: 1, name: 'Leanne Graham', email: 'leanne@example.com', company: { name: 'Romaguera-Crona' } };
    expect(mapUserFromApi(apiUser)).toEqual({
      id: 1,
      firstName: 'Leanne',
      lastName: 'Graham',
      email: 'leanne@example.com',
      department: 'Romaguera-Crona',
    });
  });

  it('handles a single-word name gracefully', () => {
    const apiUser = { id: 2, name: 'Cher', email: 'cher@example.com', company: {} };
    const result = mapUserFromApi(apiUser);
    expect(result.firstName).toBe('Cher');
    expect(result.lastName).toBe('');
  });
});

describe('mapUserToApi', () => {
  it('recombines firstName/lastName into name and department into company.name', () => {
    const user = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', department: 'Engineering' };
    expect(mapUserToApi(user)).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: { name: 'Engineering' },
    });
  });
});

describe('userService HTTP calls', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchUsers returns mapped users on success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: 'Leanne Graham', email: 'l@example.com', company: { name: 'Acme' } }],
    });

    const users = await fetchUsers();
    expect(users).toHaveLength(1);
    expect(users[0].firstName).toBe('Leanne');
  });

  it('fetchUsers throws a descriptive error on a failed response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchUsers()).rejects.toThrow('Request failed with status 500');
  });

  it('createUser merges the generated id with the submitted fields', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 11 }) });
    const newUser = { firstName: 'New', lastName: 'User', email: 'new@example.com', department: 'Sales' };
    const result = await createUser(newUser);
    expect(result).toEqual({ ...newUser, id: 11 });
  });

  it('deleteUser resolves true on success', async () => {
    global.fetch.mockResolvedValue({ ok: true });
    await expect(deleteUser(1)).resolves.toBe(true);
  });

  it('deleteUser throws on failure', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(deleteUser(1)).rejects.toThrow('Request failed with status 404');
  });
});

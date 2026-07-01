import { useState, useEffect, useMemo, useCallback } from 'react';
import * as userService from '../services/userService';
import { loadStoredUsers, saveStoredUsers, clearStoredUsers } from '../utils/storage';

const EMPTY_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState({ field: 'id', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const cached = loadStoredUsers();
    if (cached) {
      if (!cancelled) {
        setUsers(cached);
        setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }

    userService
      .fetchUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          saveStoredUsers(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load users. Please check your connection and try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addUser = useCallback(async (userData) => {
    setError(null);
    try {
      const created = await userService.createUser(userData);
      setUsers((prev) => {
        const next = [created, ...prev];
        saveStoredUsers(next);
        return next;
      });
      return true;
    } catch {
      setError('Failed to add user. Please try again.');
      return false;
    }
  }, []);

  const editUser = useCallback(async (id, userData) => {
    setError(null);
    try {
      const updated = await userService.updateUser(id, userData);
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === id ? updated : u));
        saveStoredUsers(next);
        return next;
      });
      return true;
    } catch {
      setError('Failed to update user. Please try again.');
      return false;
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    setError(null);
    try {
      await userService.deleteUser(id);
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== id);
        saveStoredUsers(next);
        return next;
      });
      return true;
    } catch {
      setError('Failed to delete user. Please try again.');
      return false;
    }
  }, []);

  const fetchUserForEdit = useCallback(async (id) => {
    try {
      return await userService.fetchUserById(id);
    } catch {
      return null;
    }
  }, []);

  const resetToSeedData = useCallback(async () => {
    setError(null);
    setLoading(true);
    clearStoredUsers();
    try {
      const data = await userService.fetchUsers();
      setUsers(data);
      saveStoredUsers(data);
    } catch {
      setError('Could not reset data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const processedUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((u) =>
        [u.firstName, u.lastName, u.email, u.department]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }

    Object.entries(filters).forEach(([field, value]) => {
      if (value && value.trim()) {
        const q = value.trim().toLowerCase();
        result = result.filter((u) => (u[field] || '').toLowerCase().includes(q));
      }
    });

    const { field, direction } = sortBy;
    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [users, search, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, sortBy, pageSize]);

  return {
    users: paginatedUsers,
    totalResults: processedUsers.length,
    loading,
    error,
    clearError: () => setError(null),
    addUser,
    editUser,
    removeUser,
    fetchUserForEdit,
    resetToSeedData,
    search,
    setSearch,
    filters,
    setFilters,
    clearFilters: () => setFilters(EMPTY_FILTERS),
    sortBy,
    setSortBy,
    page: currentPage,
    setPage,
    totalPages,
    pageSize,
    setPageSize,
  };
}
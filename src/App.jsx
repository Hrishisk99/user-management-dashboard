import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorBanner from './components/ErrorBanner';

/**
 * App
 * Top-level component. Owns only UI/modal visibility state; all user
 * data logic lives in the useUsers hook.
 */
export default function App() {
  const {
    users,
    totalResults,
    loading,
    error,
    clearError,
    addUser,
    editUser,
    removeUser,
    search,
    setSearch,
    filters,
    setFilters,
    clearFilters,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageSize,
    setPageSize,
  } = useUsers();

  const [formMode, setFormMode] = useState(null); // null | 'add' | 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userPendingDelete, setUserPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const activeFilterCount = Object.values(filters).filter((v) => v && v.trim()).length;

  const openAddForm = () => {
    setEditingUser(null);
    setFormMode('add');
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingUser(null);
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    const success =
      formMode === 'edit' ? await editUser(editingUser.id, values) : await addUser(values);
    setSubmitting(false);
    if (success) closeForm();
  };

  const handleDeleteConfirm = async () => {
    const target = userPendingDelete;
    setUserPendingDelete(null);
    await removeUser(target.id);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Add User
        </button>
      </header>

      <ErrorBanner message={error} onDismiss={clearError} />

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <button className="btn btn-secondary" onClick={() => setShowFilters(true)}>
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        {activeFilterCount > 0 && (
          <button className="btn btn-link" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : (
        <>
          <UserTable
            users={users}
            sortBy={sortBy}
            onSort={setSortBy}
            onEdit={openEditForm}
            onDelete={setUserPendingDelete}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalResults={totalResults}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {formMode && (
        <UserForm
          initialUser={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      {showFilters && (
        <FilterPopup
          filters={filters}
          onApply={setFilters}
          onClear={clearFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {userPendingDelete && (
        <ConfirmDialog
          title="Delete user?"
          message={`This will permanently remove ${userPendingDelete.firstName} ${userPendingDelete.lastName}.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUserPendingDelete(null)}
        />
      )}
    </div>
  );
}

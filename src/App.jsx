import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorBanner from './components/ErrorBanner';
import { PlusIcon, FilterIcon, RefreshIcon } from './components/icons';

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
    fetchUserForEdit,
    resetToSeedData,
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeFilterCount = Object.values(filters).filter((v) => v && v.trim()).length;

  const openAddForm = () => {
    setEditingUser(null);
    setFormMode('add');
  };

  const openEditForm = async (user) => {
    setEditingUser(user);
    setFormMode('edit');
    const fresh = await fetchUserForEdit(user.id);
    if (fresh) setEditingUser(fresh);
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

  const handleResetConfirm = async () => {
    setShowResetConfirm(false);
    await resetToSeedData();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Directory</p>
          <h1>User Management Dashboard</h1>
        </div>
        <button className="btn btn-primary" onClick={openAddForm}>
          <PlusIcon width={15} height={15} /> Add User
        </button>
      </header>

      <ErrorBanner message={error} onDismiss={clearError} />

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <button className="btn btn-secondary" onClick={() => setShowFilters(true)}>
          <FilterIcon width={14} height={14} /> Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        {activeFilterCount > 0 && (
          <button className="btn btn-link" onClick={clearFilters}>
            Clear filters
          </button>
        )}
        <button className="btn btn-secondary btn-icon" onClick={() => setShowResetConfirm(true)} title="Reset to original seed data" aria-label="Reset demo data">
          <RefreshIcon width={14} height={14} />
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Loading users...
        </div>
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

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset demo data?"
          message="This clears any local Add/Edit/Delete changes and reloads the original seed data from the API."
          confirmLabel="Reset"
          onConfirm={handleResetConfirm}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}
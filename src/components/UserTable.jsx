import React from 'react';

const COLUMNS = [
  { field: 'id', label: 'ID' },
  { field: 'firstName', label: 'First Name' },
  { field: 'lastName', label: 'Last Name' },
  { field: 'email', label: 'Email' },
  { field: 'department', label: 'Department' },
];

/**
 * UserTable
 * Renders the user list with clickable, sortable column headers and
 * per-row Edit/Delete actions. Purely presentational - all state lives
 * in useUsers and is passed down as props.
 */
export default function UserTable({ users, sortBy, onSort, onEdit, onDelete }) {
  const handleHeaderClick = (field) => {
    const direction = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    onSort({ field, direction });
  };

  if (users.length === 0) {
    return <div className="empty-state">No users match your search or filters.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.field} onClick={() => handleHeaderClick(col.field)}>
                {col.label}
                {sortBy.field === col.field && (
                  <span className="sort-indicator">{sortBy.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="First Name">{user.firstName}</td>
              <td data-label="Last Name">{user.lastName}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Department">{user.department}</td>
              <td data-label="Actions" className="actions-col">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

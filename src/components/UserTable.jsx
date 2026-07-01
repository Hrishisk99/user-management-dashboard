import React from 'react';
import { ChevronUp, ChevronDown } from './icons';
import { getDepartmentColor, getInitials } from '../utils/departmentTags';

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
    return (
      <div className="empty-state">
        <p className="empty-state-title">No matching users</p>
        <p className="empty-state-sub">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.field} onClick={() => handleHeaderClick(col.field)}>
                <span className="th-inner">
                  {col.label}
                  {sortBy.field === col.field ? (
                    sortBy.direction === 'asc' ? <ChevronUp width={13} height={13} /> : <ChevronDown width={13} height={13} />
                  ) : (
                    <span className="sort-indicator-idle" />
                  )}
                </span>
              </th>
            ))}
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const tag = getDepartmentColor(user.department);
            return (
              <tr key={user.id}>
                <td data-label="ID" className="id-cell">{user.id}</td>
                <td data-label="First Name">
                  <div className="name-cell">
                    <span className="avatar" style={{ background: tag.bg, color: tag.fg }}>
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                    <span>{user.firstName}</span>
                  </div>
                </td>
                <td data-label="Last Name">{user.lastName}</td>
                <td data-label="Email" className="email-cell">{user.email}</td>
                <td data-label="Department">{user.department || '—'}</td>
                <td data-label="Actions" className="actions-col">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(user)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
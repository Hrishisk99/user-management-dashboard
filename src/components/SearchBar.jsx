import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons';

/**
 * SearchBar
 * Debounces keystrokes by 300ms before pushing the value up to useUsers,
 * so we don't re-filter the whole list on every single character typed.
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(localValue), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  return (
    <div className="search-wrapper">
      <SearchIcon className="search-icon" width={16} height={16} />
      <input
        type="search"
        className="search-bar"
        placeholder="Search by name, email, or department..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search users"
      />
    </div>
  );
}
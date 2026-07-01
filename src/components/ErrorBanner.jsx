import React from 'react';

/**
 * ErrorBanner
 * Simple dismissible banner shown when an API request fails. Centralizing
 * error display here (rather than alert()) keeps the UI consistent and
 * testable.
 */
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
        ×
      </button>
    </div>
  );
}

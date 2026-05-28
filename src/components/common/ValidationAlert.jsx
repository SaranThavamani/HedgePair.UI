import React from 'react';

/**
 * Displays a dismissible validation/error alert.
 * @param {{ message: string, onDismiss: () => void }} props
 */
export default function ValidationAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      className="alert alert-danger alert-dismissible fade show d-flex align-items-start"
      role="alert"
      data-testid="validation-alert"
    >
      <i className="bi bi-exclamation-triangle-fill me-2 mt-1 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
      <button
        type="button"
        className="btn-close ms-auto"
        aria-label="Close"
        onClick={onDismiss}
      />
    </div>
  );
}

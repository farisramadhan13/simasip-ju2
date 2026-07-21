import React from "react";

interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "info" | "success" | "warning" | "error";
}

export default function CustomAlert({ isOpen, title, message, onClose, type = "info" }: CustomAlertProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{getIcon()}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{message}</p>
          <button className="btn-primary btn-full" onClick={onClose}>Mengerti</button>
        </div>
      </div>
    </div>
  );
}

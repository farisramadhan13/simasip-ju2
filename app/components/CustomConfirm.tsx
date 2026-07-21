import React from "react";

interface CustomConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function CustomConfirm({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal"
}: CustomConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{message}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary btn-full" onClick={onCancel}>{cancelText}</button>
            <button className="btn-primary btn-full" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

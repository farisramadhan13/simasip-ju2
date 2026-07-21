import React, { useState } from "react";

interface DeleteVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteVerificationModal({ 
  isOpen, 
  onConfirm, 
  onCancel,
  isDeleting
}: DeleteVerificationModalProps) {
  const [inputText, setInputText] = useState("");
  
  const expectedText = "Saya Yakin Ingin Menghapus Disposisi Ini";
  const isMatch = inputText === expectedText;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 style={{ color: '#ef4444' }}>Konfirmasi Penghapusan</h2>
          <button onClick={onCancel} className="btn-icon" disabled={isDeleting}>✖</button>
        </div>
        <div className="modal-body">
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <strong>Peringatan!</strong> Tindakan ini akan menghapus data disposisi secara permanen. Data yang dihapus tidak dapat dikembalikan.
          </div>
          
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Untuk melanjutkan, silakan ketik kalimat berikut persis sama (perhatikan huruf besar/kecil):
          </p>
          
          <div style={{ userSelect: 'none', backgroundColor: 'var(--surface)', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '1rem', border: '1px dashed var(--border-color)' }}>
            {expectedText}
          </div>
          
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ketik di sini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isDeleting}
            autoComplete="off"
          />
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel} disabled={isDeleting}>Batal</button>
          <button 
            className={`btn-primary ${isDeleting ? 'btn-loading' : ''}`} 
            style={{ backgroundColor: isMatch ? '#ef4444' : 'var(--border-color)', opacity: isMatch ? 1 : 0.5, cursor: isMatch ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (isMatch) onConfirm();
            }}
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus Permanen"}
          </button>
        </div>
      </div>
    </div>
  );
}

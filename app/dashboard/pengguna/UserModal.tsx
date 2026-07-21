import { useState, useEffect } from "react";

export default function UserModal({ 
  isOpen, 
  onClose, 
  onSave, 
  user 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => Promise<void>;
  user?: any;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    unit: "",
    role: "user",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        position: user.position,
        unit: user.unit,
        role: user.role,
        password: "" // password is blank for edit unless they want to change it
      });
    } else {
      setFormData({
        name: "",
        email: "",
        position: "",
        unit: "",
        role: "user",
        password: ""
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h2>
          <button onClick={onClose} className="btn-icon">✖</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Email / Login ID</label>
              <input type="email" className="form-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Jabatan</label>
              <input type="text" className="form-input" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Unit Kerja</label>
              <input type="text" className="form-input" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Peran (Role)</label>
              <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="user">User / Staf</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password {user && <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>(Kosongkan jika tidak ingin diubah)</span>}</label>
              <input type="password" className="form-input" required={!user} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={`btn-primary ${isSubmitting ? 'btn-loading' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? (
                <><div className="spinner spinner-small" style={{ borderLeftColor: '#fff' }}></div> <span>Menyimpan...</span></>
              ) : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

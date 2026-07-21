"use client";

import { useState, useEffect } from "react";
import UserModal from "./UserModal";

export default function ManajemenPenggunaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        alert(data.message || "Gagal memuat data pengguna");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData: any) => {
    const isEditing = !!selectedUser;
    const url = isEditing ? `/api/users/${selectedUser.id}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Gagal menyimpan pengguna");
    }

    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        const data = await res.json();
        
        if (!res.ok) {
          alert(data.message || "Gagal menghapus pengguna");
        } else {
          fetchUsers();
        }
      } catch (err) {
        alert("Terjadi kesalahan jaringan");
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Manajemen Pengguna</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Tambah Pengguna</button>
      </div>

      {isLoading ? (
        <div className="spinner-centered">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email / ID Login</th>
                <th>Jabatan & Unit</th>
                <th>Peran</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{user.position}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.unit}</div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role === 'admin' ? 'Administrator' : 'User / Staf'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="Edit" onClick={() => handleOpenModal(user)}>
                      ✏️
                    </button>
                    <button className="btn-icon btn-icon-danger" title="Hapus" onClick={() => handleDelete(user.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Belum ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveUser} 
        user={selectedUser} 
      />
    </div>
  );
}

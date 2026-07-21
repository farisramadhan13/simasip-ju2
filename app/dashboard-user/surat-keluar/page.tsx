"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import CustomAlert from "@/app/components/CustomAlert";
import CustomConfirm from "@/app/components/CustomConfirm";
import DeleteVerificationModal from "@/app/components/DeleteVerificationModal";

export default function SuratKeluarPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Custom Modals
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" as any });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, pendingFile: null as File | null });
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, idToDelete: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nomorUrut: "", tanggalKeluar: "", nomorSurat: "", perihal: "", ditujukan: "", tembusan: "",
    keterangan: "", fileSuratUrl: "", petugas: "", status: "Draft"
  });

  const fetchSuratKeluar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/surat-keluar");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      showAlert("Error", "Gagal memuat data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, []);

  const showAlert = (title: string, message: string, type: any = "info") => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const resetForm = () => {
    setFormData({
      nomorUrut: "", tanggalKeluar: "", nomorSurat: "", perihal: "", ditujukan: "", tembusan: "",
      keterangan: "", fileSuratUrl: "", petugas: "", status: "Draft"
    });
  };

  const openAddModal = () => {
    setSelectedItem(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setFormData({
      nomorUrut: item.nomorUrut || "",
      tanggalKeluar: item.tanggalKeluar ? new Date(item.tanggalKeluar).toISOString().split('T')[0] : "",
      nomorSurat: item.nomorSurat || "",
      perihal: item.perihal || "",
      ditujukan: item.ditujukan || "",
      tembusan: item.tembusan || "",
      keterangan: item.keterangan || "",
      fileSuratUrl: item.fileSuratUrl || "",
      petugas: item.petugas || "",
      status: item.status || "Draft"
    });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeleteModalConfig({ isOpen: true, idToDelete: id });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/surat-keluar/${deleteModalConfig.idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteModalConfig({ isOpen: false, idToDelete: "" });
        showAlert("Berhasil", "Data surat keluar telah dihapus secara permanen.", "success");
        fetchSuratKeluar();
      } else {
        showAlert("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
      }
    } catch (e) {
      showAlert("Error", "Masalah koneksi server.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      if (file.type.startsWith("image/")) {
        setConfirmConfig({
          isOpen: true,
          title: "Ukuran File Terlalu Besar",
          message: `Ukuran gambar ${file.name} melebihi batas 5MB. Apakah Anda ingin mengizinkan sistem untuk mengompres gambar ini secara otomatis?`,
          pendingFile: file,
          onConfirm: () => compressAndProcessFile(file, fieldName)
        });
      } else {
        showAlert("File Terlalu Besar", "Batas maksimal adalah 5MB. Untuk file PDF/Dokumen yang besar, silakan kompres sendiri terlebih dahulu sebelum diunggah.", "warning");
        e.target.value = "";
      }
      return;
    }
    
    processBase64(file, fieldName);
  };

  const compressAndProcessFile = async (file: File, fieldName: string) => {
    setConfirmConfig({ ...confirmConfig, isOpen: false });
    try {
      showAlert("Mengompresi...", "Sistem sedang mengompresi gambar Anda...", "info");
      const compressedFile = await imageCompression(file, { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true });
      processBase64(compressedFile, fieldName);
      setAlertConfig({ ...alertConfig, isOpen: false });
    } catch (error) {
      showAlert("Gagal", "Gagal mengompres gambar.", "error");
    }
  };

  const processBase64 = (file: File, fieldName: string) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isEditing = !!selectedItem;
      const url = isEditing ? `/api/surat-keluar/${selectedItem.id}` : "/api/surat-keluar";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsFormModalOpen(false);
        showAlert("Berhasil", `Data surat keluar berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`, "success");
        fetchSuratKeluar();
      } else {
        showAlert("Gagal", "Mohon periksa kembali isian formulir.", "error");
      }
    } catch (e) {
      showAlert("Error", "Gagal terhubung ke server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "Draft": return "badge-danger";
      case "Menunggu TTD Pimpinan": return "badge-warning";
      case "Revisi": return "badge-warning";
      case "Terkirim": return "badge-success";
      case "Dibatalkan": return "badge-danger";
      default: return "";
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Daftar Surat Keluar</h1>
        <button className="btn-primary" onClick={openAddModal}>+ Tambah Surat Keluar</button>
      </div>

      {isLoading ? (
        <div className="spinner-centered"><div className="spinner"></div></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Surat</th>
                <th>Perihal</th>
                <th>Ditujukan Kepada</th>
                <th>Tgl Keluar</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.nomorSurat}</td>
                  <td>{item.perihal}</td>
                  <td>{item.ditujukan}</td>
                  <td>{item.tanggalKeluar ? new Date(item.tanggalKeluar).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button className="btn-icon" onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true); }} title="Detail Lengkap">👁️</button>
                    <button className="btn-icon" onClick={() => openEditModal(item)} title="Edit">✏️</button>
                    <button className="btn-icon btn-icon-danger" onClick={() => openDeleteModal(item.id)} title="Hapus">🗑️</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada data surat keluar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal (Tambah/Edit) */}
      {isFormModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>{selectedItem ? "Edit Surat Keluar" : "Tambah Surat Keluar Baru"}</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="btn-icon">✖</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxHeight: '65vh', overflowY: 'auto' }}>
                
                {/* Kolom Kiri */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">Nomor Urut</label><input type="text" className="form-input" required value={formData.nomorUrut} onChange={e => setFormData({...formData, nomorUrut: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Tanggal Keluar</label><input type="date" className="form-input" required value={formData.tanggalKeluar} onChange={e => setFormData({...formData, tanggalKeluar: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Nomor Surat</label><input type="text" className="form-input" required value={formData.nomorSurat} onChange={e => setFormData({...formData, nomorSurat: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Perihal</label><textarea className="form-input" required value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Ditujukan Kepada</label><input type="text" className="form-input" required value={formData.ditujukan} onChange={e => setFormData({...formData, ditujukan: e.target.value})} /></div>
                </div>

                {/* Kolom Kanan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">Tembusan</label><input type="text" className="form-input" value={formData.tembusan} onChange={e => setFormData({...formData, tembusan: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Keterangan Tambahan</label><textarea className="form-input" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Petugas Pencatat</label><input type="text" className="form-input" required value={formData.petugas} onChange={e => setFormData({...formData, petugas: e.target.value})} /></div>
                  <div className="form-group">
                    <label className="form-label">File Surat (Maks 5MB)</label>
                    <input type="file" className="form-input" onChange={e => handleFileUpload(e, "fileSuratUrl")} accept="image/*,application/pdf" />
                    {formData.fileSuratUrl && <small style={{ color: 'var(--accent-purple)' }}>File tersimpan.</small>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Penanganan</label>
                    <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Draft">Draft</option>
                      <option value="Menunggu TTD Pimpinan">Menunggu TTD Pimpinan</option>
                      <option value="Revisi">Revisi</option>
                      <option value="Terkirim">Terkirim</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsFormModalOpen(false)}>Batal</button>
                <button type="submit" className={`btn-primary ${isSaving ? 'btn-loading' : ''}`} disabled={isSaving}>
                  {isSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="modal-overlay" style={{ zIndex: 40 }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Detail Surat Keluar: {selectedItem.nomorSurat}</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="btn-icon">✖</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="detail-group"><span className="detail-label">1. Nomor Urut</span><div className="detail-value">{selectedItem.nomorUrut}</div></div>
              <div className="detail-group"><span className="detail-label">2. Tanggal Keluar</span><div className="detail-value">{selectedItem.tanggalKeluar ? new Date(selectedItem.tanggalKeluar).toLocaleDateString() : '-'}</div></div>
              <div className="detail-group"><span className="detail-label">3. Nomor Surat</span><div className="detail-value">{selectedItem.nomorSurat}</div></div>
              <div className="detail-group"><span className="detail-label">4. Perihal</span><div className="detail-value">{selectedItem.perihal}</div></div>
              <div className="detail-group"><span className="detail-label">5. Ditujukan Kepada</span><div className="detail-value">{selectedItem.ditujukan}</div></div>
              <div className="detail-group"><span className="detail-label">6. Tembusan</span><div className="detail-value">{selectedItem.tembusan || "-"}</div></div>
              <div className="detail-group"><span className="detail-label">7. Keterangan</span><div className="detail-value">{selectedItem.keterangan || "-"}</div></div>
              <div className="detail-group">
                <span className="detail-label">8. File Surat</span>
                <div className="detail-value">{selectedItem.fileSuratUrl ? <a href={selectedItem.fileSuratUrl} download="File_Surat_Keluar" style={{ color: 'var(--accent-purple)' }}>Unduh/Lihat File 📄</a> : "-"}</div>
              </div>
              <div className="detail-group"><span className="detail-label">9. Petugas</span><div className="detail-value">{selectedItem.petugas}</div></div>
              <div className="detail-group">
                <span className="detail-label">10. Status</span>
                <div className="detail-value"><span className={`badge ${getStatusBadgeClass(selectedItem.status)}`}>{selectedItem.status.toUpperCase()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomAlert {...alertConfig} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />
      <CustomConfirm {...confirmConfig} onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })} />
      <DeleteVerificationModal isOpen={deleteModalConfig.isOpen} isDeleting={isDeleting} onCancel={() => setDeleteModalConfig({ isOpen: false, idToDelete: "" })} onConfirm={handleDelete} />
    </div>
  );
}

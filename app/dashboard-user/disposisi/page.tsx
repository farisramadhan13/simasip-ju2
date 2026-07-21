"use client";

import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import CustomAlert from "@/app/components/CustomAlert";
import CustomConfirm from "@/app/components/CustomConfirm";
import DeleteVerificationModal from "@/app/components/DeleteVerificationModal";

export default function DisposisiPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDisposisi, setSelectedDisposisi] = useState<any>(null);
  
  // Custom Modals
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" as any });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {}, pendingFile: null as File | null });
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, idToDelete: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nomorUrut: "", tanggalPenerimaan: "", nomorSurat: "", tanggalSurat: "", sasaran: "", perihal: "",
    fileSuratUrl: "", fileDisposisiUrl: "", bidangPengelola: "", tanggalDisposisi: "",
    disposisiPimpinan: "", tanggalMasukSeksi: "", nomorUrutSeksi: "", petugas: "",
    keterangan: "", status: "belum diproses"
  });

  const fetchDisposisi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/disposisi");
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
    fetchDisposisi();
  }, []);

  const showAlert = (title: string, message: string, type: any = "info") => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const resetForm = () => {
    setFormData({
      nomorUrut: "", tanggalPenerimaan: "", nomorSurat: "", tanggalSurat: "", sasaran: "", perihal: "",
      fileSuratUrl: "", fileDisposisiUrl: "", bidangPengelola: "", tanggalDisposisi: "",
      disposisiPimpinan: "", tanggalMasukSeksi: "", nomorUrutSeksi: "", petugas: "",
      keterangan: "", status: "belum diproses"
    });
  };

  const openAddModal = () => {
    setSelectedDisposisi(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setSelectedDisposisi(item);
    setFormData({
      nomorUrut: item.nomorUrut || "",
      tanggalPenerimaan: item.tanggalPenerimaan ? new Date(item.tanggalPenerimaan).toISOString().split('T')[0] : "",
      nomorSurat: item.nomorSurat || "",
      tanggalSurat: item.tanggalSurat ? new Date(item.tanggalSurat).toISOString().split('T')[0] : "",
      sasaran: item.sasaran || "",
      perihal: item.perihal || "",
      fileSuratUrl: item.fileSuratUrl || "",
      fileDisposisiUrl: item.fileDisposisiUrl || "",
      bidangPengelola: item.bidangPengelola || "",
      tanggalDisposisi: item.tanggalDisposisi ? new Date(item.tanggalDisposisi).toISOString().split('T')[0] : "",
      disposisiPimpinan: item.disposisiPimpinan || "",
      tanggalMasukSeksi: item.tanggalMasukSeksi ? new Date(item.tanggalMasukSeksi).toISOString().split('T')[0] : "",
      nomorUrutSeksi: item.nomorUrutSeksi || "",
      petugas: item.petugas || "",
      keterangan: item.keterangan || "",
      status: item.status || "belum diproses"
    });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeleteModalConfig({ isOpen: true, idToDelete: id });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/disposisi/${deleteModalConfig.idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteModalConfig({ isOpen: false, idToDelete: "" });
        showAlert("Berhasil", "Data disposisi telah dihapus secara permanen.", "success");
        fetchDisposisi();
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
      const isEditing = !!selectedDisposisi;
      const url = isEditing ? `/api/disposisi/${selectedDisposisi.id}` : "/api/disposisi";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsFormModalOpen(false);
        showAlert("Berhasil", `Data disposisi berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`, "success");
        fetchDisposisi();
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
      case "belum diproses": return "badge-danger";
      case "sedang diproses": return "badge-warning";
      case "selesai diproses": return "badge-success";
      default: return "";
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Daftar Disposisi</h1>
        <button className="btn-primary" onClick={openAddModal}>+ Tambah Disposisi</button>
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
                <th>Tgl Terima</th>
                <th>Pengelola</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.nomorSurat}</td>
                  <td>{item.perihal}</td>
                  <td>{item.tanggalPenerimaan ? new Date(item.tanggalPenerimaan).toLocaleDateString() : '-'}</td>
                  <td>{item.bidangPengelola}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button className="btn-icon" onClick={() => { setSelectedDisposisi(item); setIsDetailModalOpen(true); }} title="Detail Lengkap">👁️</button>
                    <button className="btn-icon" onClick={() => openEditModal(item)} title="Edit">✏️</button>
                    <button className="btn-icon btn-icon-danger" onClick={() => openDeleteModal(item.id)} title="Hapus">🗑️</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Belum ada data disposisi.</td>
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
              <h2>{selectedDisposisi ? "Edit Disposisi" : "Tambah Disposisi Baru"}</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="btn-icon">✖</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                
                {/* Kolom Kiri */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">Nomor Urut</label><input type="text" className="form-input" required value={formData.nomorUrut} onChange={e => setFormData({...formData, nomorUrut: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Tanggal Penerimaan</label><input type="date" className="form-input" required value={formData.tanggalPenerimaan} onChange={e => setFormData({...formData, tanggalPenerimaan: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Nomor Surat</label><input type="text" className="form-input" required value={formData.nomorSurat} onChange={e => setFormData({...formData, nomorSurat: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Tanggal Surat</label><input type="date" className="form-input" required value={formData.tanggalSurat} onChange={e => setFormData({...formData, tanggalSurat: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Sasaran</label><input type="text" className="form-input" required value={formData.sasaran} onChange={e => setFormData({...formData, sasaran: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Perihal</label><textarea className="form-input" required value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} /></div>
                  <div className="form-group">
                    <label className="form-label">File Surat (Maks 5MB)</label>
                    <input type="file" className="form-input" onChange={e => handleFileUpload(e, "fileSuratUrl")} accept="image/*,application/pdf" />
                    {formData.fileSuratUrl && <small style={{ color: 'var(--accent-purple)' }}>File tersimpan.</small>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">File Disposisi (Maks 5MB)</label>
                    <input type="file" className="form-input" onChange={e => handleFileUpload(e, "fileDisposisiUrl")} accept="image/*,application/pdf" />
                    {formData.fileDisposisiUrl && <small style={{ color: 'var(--accent-purple)' }}>File tersimpan.</small>}
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">Bidang Pengelola</label><input type="text" className="form-input" required value={formData.bidangPengelola} onChange={e => setFormData({...formData, bidangPengelola: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Tanggal Disposisi</label><input type="date" className="form-input" value={formData.tanggalDisposisi} onChange={e => setFormData({...formData, tanggalDisposisi: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Disposisi Pimpinan</label><input type="text" className="form-input" value={formData.disposisiPimpinan} onChange={e => setFormData({...formData, disposisiPimpinan: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Tanggal Masuk Seksi</label><input type="date" className="form-input" value={formData.tanggalMasukSeksi} onChange={e => setFormData({...formData, tanggalMasukSeksi: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Nomor Urut Seksi</label><input type="text" className="form-input" value={formData.nomorUrutSeksi} onChange={e => setFormData({...formData, nomorUrutSeksi: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Petugas</label><input type="text" className="form-input" value={formData.petugas} onChange={e => setFormData({...formData, petugas: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Keterangan</label><textarea className="form-input" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} /></div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="belum diproses">Belum Diproses</option>
                      <option value="sedang diproses">Sedang Diproses</option>
                      <option value="selesai diproses">Selesai Diproses</option>
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
      {isDetailModalOpen && selectedDisposisi && (
        <div className="modal-overlay" style={{ zIndex: 40 }}>
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Detail Disposisi: {selectedDisposisi.nomorSurat}</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="btn-icon">✖</button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="detail-group"><span className="detail-label">1. Nomor Urut</span><div className="detail-value">{selectedDisposisi.nomorUrut}</div></div>
                  <div className="detail-group"><span className="detail-label">2. Tanggal Penerimaan</span><div className="detail-value">{selectedDisposisi.tanggalPenerimaan ? new Date(selectedDisposisi.tanggalPenerimaan).toLocaleDateString() : '-'}</div></div>
                  <div className="detail-group"><span className="detail-label">3. Nomor Surat</span><div className="detail-value">{selectedDisposisi.nomorSurat}</div></div>
                  <div className="detail-group"><span className="detail-label">4. Tanggal Surat</span><div className="detail-value">{selectedDisposisi.tanggalSurat ? new Date(selectedDisposisi.tanggalSurat).toLocaleDateString() : '-'}</div></div>
                  <div className="detail-group"><span className="detail-label">5. Sasaran</span><div className="detail-value">{selectedDisposisi.sasaran}</div></div>
                  <div className="detail-group"><span className="detail-label">6. Perihal</span><div className="detail-value">{selectedDisposisi.perihal}</div></div>
                  <div className="detail-group">
                    <span className="detail-label">7. File Surat</span>
                    <div className="detail-value">{selectedDisposisi.fileSuratUrl ? <a href={selectedDisposisi.fileSuratUrl} download="File_Surat" style={{ color: 'var(--accent-purple)' }}>Unduh/Lihat File 📄</a> : "-"}</div>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">8. File Disposisi</span>
                    <div className="detail-value">{selectedDisposisi.fileDisposisiUrl ? <a href={selectedDisposisi.fileDisposisiUrl} download="File_Disposisi" style={{ color: 'var(--accent-purple)' }}>Unduh/Lihat File 📄</a> : "-"}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="detail-group"><span className="detail-label">9. Bidang Pengelola</span><div className="detail-value">{selectedDisposisi.bidangPengelola}</div></div>
                  <div className="detail-group"><span className="detail-label">10. Tanggal Disposisi</span><div className="detail-value">{selectedDisposisi.tanggalDisposisi ? new Date(selectedDisposisi.tanggalDisposisi).toLocaleDateString() : "-"}</div></div>
                  <div className="detail-group"><span className="detail-label">11. Disposisi Pimpinan</span><div className="detail-value">{selectedDisposisi.disposisiPimpinan || "-"}</div></div>
                  <div className="detail-group"><span className="detail-label">12. Tanggal Masuk Seksi</span><div className="detail-value">{selectedDisposisi.tanggalMasukSeksi ? new Date(selectedDisposisi.tanggalMasukSeksi).toLocaleDateString() : "-"}</div></div>
                  <div className="detail-group"><span className="detail-label">13. Nomor Urut Seksi</span><div className="detail-value">{selectedDisposisi.nomorUrutSeksi || "-"}</div></div>
                  <div className="detail-group"><span className="detail-label">14. Petugas</span><div className="detail-value">{selectedDisposisi.petugas || "-"}</div></div>
                  <div className="detail-group"><span className="detail-label">15. Keterangan</span><div className="detail-value">{selectedDisposisi.keterangan || "-"}</div></div>
                  <div className="detail-group">
                    <span className="detail-label">16. Status</span>
                    <div className="detail-value"><span className={`badge ${getStatusBadgeClass(selectedDisposisi.status)}`}>{selectedDisposisi.status.toUpperCase()}</span></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      <CustomAlert {...alertConfig} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />
      <CustomConfirm 
        {...confirmConfig} 
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })} 
      />
      <DeleteVerificationModal 
        isOpen={deleteModalConfig.isOpen}
        isDeleting={isDeleting}
        onCancel={() => setDeleteModalConfig({ isOpen: false, idToDelete: "" })}
        onConfirm={handleDelete}
      />
    </div>
  );
}

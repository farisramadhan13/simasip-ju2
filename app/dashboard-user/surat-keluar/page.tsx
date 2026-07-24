"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SuratKeluarPage() {
  const { data, error, isLoading } = useSWR("/api/sheets", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const sheetData = data?.results?.find((s: any) => s.id === "sheet-2");
  const totalItems = sheetData?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sheetData?.data?.slice(startIndex, endIndex) || [];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="sm-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .sm-container {
          padding: 2rem;
          min-height: 85vh;
          font-family: 'Inter', sans-serif;
          animation: fadeIn 0.5s ease;
        }
        .sm-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .sm-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
        .sm-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin: 0;
          background: linear-gradient(135deg, var(--accent-purple), #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sm-subtitle {
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-size: 1rem;
        }
        .sm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          background: rgba(147, 51, 234, 0.08);
          border: 1px solid rgba(147, 51, 234, 0.2);
          color: var(--accent-purple);
          font-weight: 600;
          font-size: 0.85rem;
          backdrop-filter: blur(10px);
        }
        .sm-pulse {
          width: 10px;
          height: 10px;
          background: var(--accent-purple);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
          100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
        }
        .sm-card {
          background: var(--bg-primary);
          border-radius: 1.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
          position: relative;
        }
        .sm-table-wrapper {
          max-height: 75vh;
          overflow: auto;
        }
        .sm-table-wrapper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .sm-table-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .sm-table-wrapper::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 10px;
        }
        .sm-table-wrapper::-webkit-scrollbar-thumb:hover {
          background-color: var(--text-secondary);
        }
        .sm-table {
          width: 100%;
          min-width: max-content;
          border-collapse: collapse;
        }
        .sm-table th {
          position: sticky;
          top: 0;
          background: var(--surface);
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          z-index: 10;
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }
        .sm-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.85rem;
          vertical-align: top;
        }
        .sm-table tbody tr {
          transition: var(--transition);
        }
        .sm-table tbody tr:hover {
          background: var(--surface);
          box-shadow: inset 4px 0 0 0 var(--accent-purple);
        }
        .sm-cell-content {
          max-width: 280px;
          word-break: break-word;
          line-height: 1.5;
        }
        .sm-pagination {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: var(--surface);
          border-top: 1px solid var(--border-color);
        }
        @media (min-width: 640px) {
          .sm-pagination {
            flex-direction: row;
          }
        }
        .sm-page-info {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .sm-page-info b {
          color: var(--text-primary);
        }
        .sm-page-controls {
          display: flex;
          gap: 0.5rem;
        }
        .sm-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          font-size: 0.95rem;
        }
        .sm-btn:hover:not(:disabled) {
          border-color: var(--accent-purple);
          color: var(--accent-purple);
          background: var(--surface);
        }
        .sm-btn.active {
          background: var(--accent-purple);
          color: #ffffff;
          border-color: var(--accent-purple);
          box-shadow: 0 4px 10px rgba(147, 51, 234, 0.3);
        }
        .sm-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .sm-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: var(--text-secondary);
          gap: 1rem;
        }
        .sm-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-purple);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div className="sm-header">
        <div>
          <h1 className="sm-title">Arsip Keluar</h1>
          <p className="sm-subtitle">Pantau seluruh surat keluar secara real-time yang terhubung langsung dari Google Sheets.</p>
        </div>
        <div className="sm-badge">
          <div className="sm-pulse"></div>
          Live Sinkronisasi Aktif
        </div>
      </div>

      <div className="sm-card">
        {isLoading && (
          <div className="sm-state">
            <div className="sm-spinner"></div>
            <p>Menyinkronkan data...</p>
          </div>
        )}

        {error && (
          <div className="sm-state" style={{ color: '#ef4444' }}>
            <p><b>Koneksi Terputus</b></p>
            <p>Gagal memuat data. Periksa jaringan Anda.</p>
          </div>
        )}

        {data?.success === false && (
          <div className="sm-state" style={{ color: '#ef4444', padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Gagal Mengambil Data API</p>
            <p>{data?.error}</p>
          </div>
        )}

        {!isLoading && !error && data?.success !== false && sheetData && (
          <>
            <div className="sm-table-wrapper">
              <table className="sm-table">
                <thead>
                  <tr>
                    {sheetData.data.length > 0 &&
                      Object.keys(sheetData.data[0]).map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell: any, cellIndex: number) => (
                        <td key={cellIndex}>
                          <div className="sm-cell-content">
                            {cell || <span style={{ opacity: 0.5 }}>-</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan={100} style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                        Tidak ada data surat keluar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="sm-pagination">
              <div className="sm-page-info">
                Menampilkan <b>{startIndex + 1}</b> hingga <b>{Math.min(endIndex, totalItems)}</b> dari <b>{totalItems}</b> data
              </div>
              
              {totalPages > 1 && (
                <div className="sm-page-controls">
                  <button
                    className="sm-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  
                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`sm-btn ${currentPage === num ? "active" : ""}`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className="sm-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

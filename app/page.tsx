"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // SWR: Pre-fetch semua data di latar belakang saat halaman dibuka
  const { data: sheetsData, isLoading: isLoadingSheets } = useSWR("/api/sheets", fetcher, {
    revalidateOnFocus: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Helper cerdas: Mencari kolom meskipun ada salah ketik (case-insensitive)
  const findValue = (row: any, keyword: string) => {
    const key = Object.keys(row).find((k) => k.toLowerCase().includes(keyword.toLowerCase()));
    return key ? row[key] : "-";
  };

  // Algoritma Pencarian Tercepat
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !sheetsData?.results) return [];

    // Pecah input pencarian menjadi array kata (token)
    const queryTokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    let allResults: any[] = [];

    sheetsData.results.forEach((sheet: any) => {
      let jenis = "Tidak Diketahui";
      let jenisColor = "badge-gray";

      if (sheet.id === "sheet-1") {
        jenis = "Surat Masuk";
        jenisColor = "badge-blue";
      } else if (sheet.id === "sheet-2") {
        jenis = "Surat Keluar";
        jenisColor = "badge-yellow";
      } else if (sheet.id === "sheet-3") {
        jenis = "Disposisi";
        jenisColor = "badge-purple";
      }

      sheet.data.forEach((row: any) => {
        const perihal = String(findValue(row, "perihal") || "").toLowerCase();

        // Dokumen hanya lolos jika SEMUA kata yang dicari ada di dalam Perihal
        const isMatch = queryTokens.every(token => perihal.includes(token));

        if (isMatch) {
          allResults.push({
            perihal: findValue(row, "perihal"),
            status: findValue(row, "status"),
            jenis,
            jenisColor
          });
        }
      });
    });

    return allResults.slice(0, 50); // Batasi hasil maksimal 50 agar tidak melambatkan UI
  }, [searchQuery, sheetsData]);

  return (
    <>
      {/* Tambahan CSS Khusus untuk Fitur Search */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .search-results-container {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          box-shadow: var(--shadow-lg);
          margin-top: 1rem;
          overflow: hidden;
          width: 100%;
          text-align: left;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .results-table-wrapper {
          max-height: 400px;
          overflow: auto;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .results-table th {
          background: var(--surface);
          padding: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 1px solid var(--border-color);
        }
        .results-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          vertical-align: top;
          line-height: 1.5;
        }
        .results-table tr:last-child td {
          border-bottom: none;
        }
        .results-table tr:hover td {
          background-color: var(--surface);
        }
        .search-badge {
          display: inline-flex;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .badge-blue { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
        .badge-yellow { background: rgba(234, 179, 8, 0.15); color: #ca8a04; }
        .badge-purple { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }
        .badge-gray { background: rgba(107, 114, 128, 0.1); color: #4b5563; }
        
        .no-results {
          padding: 3rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}} />

      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">
            <span className="logo-highlight">SIMASIP</span> JU 2
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {mounted && (theme === "light" ? "🌙" : "☀️")}
            </button>
            <a href="/login" className="btn-primary">
              Login Sistem
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-bg-blob"></div>
          <div className="hero-bg-blob-2"></div>
          <div className="container">
            <div className="hero-content">
              <div className="badge">
                <span className="badge-dot"></span>
                Suku Dinas Pendidikan Wilayah II Jakarta Utara
              </div>
              <h1 className="hero-title">
                Monitoring Status Surat<br />
                <span className="text-gradient">Cepat dan Lancar</span>
              </h1>
              <p className="hero-description">
                Ketikkan kata kunci dokumen. Sistem akan menelusuri seluruh Surat Masuk, Surat Keluar, dan Disposisi.
              </p>

              <div className="hero-actions" style={{ flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '850px', margin: '0 auto', marginTop: '2rem' }}>

                {/* Search Bar Container */}
                <div className="search-container" style={{ width: '100%', maxWidth: '100%', boxShadow: 'var(--shadow-lg)' }}>
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    placeholder="Contoh: Undangan Rapat Dinas Pendidikan..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Loading Indicator saat menarik seluruh data di background */}
                {isLoadingSheets && (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', animation: 'pulse 1.5s infinite' }}>
                    Menyiapkan mesin pencari. Mohon tunggu...
                  </div>
                )}

                {/* Display Hasil Pencarian */}
                {searchQuery.trim() !== "" && !isLoadingSheets && (
                  <div className="search-results-container">
                    {searchResults.length > 0 ? (
                      <div className="results-table-wrapper">
                        <table className="results-table">
                          <thead>
                            <tr>
                              <th style={{ width: '50%' }}>Perihal</th>
                              <th style={{ width: '25%' }}>Jenis Arsip</th>
                              <th style={{ width: '25%' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map((res, i) => (
                              <tr key={i}>
                                <td>{res.perihal}</td>
                                <td>
                                  <span className={`search-badge ${res.jenisColor}`}>{res.jenis}</span>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 500 }}>{res.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="no-results">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔎</div>
                        Tidak ada arsip dengan perihal yang mengandung kata <b>"{searchQuery}"</b>.
                        <br /><span style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Coba gunakan kata kunci lain.</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <a href="/dashboard-user/surat-masuk" className="btn-secondary" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    Masuk ke Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slogan Tambahan */}
        <section id="features" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✨</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--text-primary), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Surat Terjaga dan Tertata
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
              Mewujudkan tata kelola persuratan yang aman dan. Temukan dokumen penting Anda.
              <br /><br />
              <b>SIMASIP</b> hadir untuk memastikan setiap lembar informasi terjaga dengan aman.
            </p>
          </div>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <div className="container">
          © 2026 Suku Dinas Pendidikan Wilayah II Jakarta Utara.
        </div>
      </footer>
    </>
  );
}

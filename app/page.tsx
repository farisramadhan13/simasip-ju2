"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

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

  return (
    <>
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
                Sistem Manajemen Arsip <br />
                <span className="text-gradient">Terintegrasi & Aman</span>
              </h1>
              <p className="hero-description">
                Platform digital resmi untuk pengelolaan, penyimpanan, dan pencarian dokumen arsip Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara.
              </p>
              <div className="hero-actions">
                <a href="#features" className="btn-primary">
                  Pelajari Lebih Lanjut
                </a>
                <a href="#panduan" className="btn-secondary">
                  Buku Panduan
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Fitur Unggulan</h2>
              <p className="section-subtitle">
                Kemudahan dalam mengelola arsip digital dengan teknologi terkini yang aman, cepat, dan responsif.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📁</div>
                <h3 className="feature-title">Penyimpanan Terpusat</h3>
                <p className="feature-desc">
                  Simpan seluruh dokumen arsip dalam satu sistem terpusat yang mudah diakses kapan saja dan di mana saja.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Pencarian Cepat</h3>
                <p className="feature-desc">
                  Temukan dokumen yang Anda butuhkan dalam hitungan detik dengan fitur pencarian yang akurat dan efisien.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Monitoring Surat</h3>
                <p className="feature-desc">
                  Pantau status surat masuk, keluar, dan disposisi secara langsung dengan pembaruan data yang cepat dan transparan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-highlight">SIMASIP</span> JU 2
              </div>
              <p className="footer-desc">
                Sistem Manajemen Arsip Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara. Mewujudkan administrasi digital yang efektif dan transparan.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-links-title">Tautan Penting</div>
              <a href="#" className="footer-link">Portal Resmi</a>
              <a href="#" className="footer-link">Panduan Pengguna</a>
              <a href="#" className="footer-link">FAQ</a>
            </div>

            <div className="footer-links-group">
              <div className="footer-links-title">Kontak</div>
              <a href="#" className="footer-link">Bantuan Teknis</a>
              <a href="#" className="footer-link">Hubungi Kami</a>
            </div>
          </div>

          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

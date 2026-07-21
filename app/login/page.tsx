"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // Simple check to ensure we only render full content after hydration if needed,
  // but since we are not heavily relying on theme for layout shifts here, we can just render.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <Link href="/" className="btn-back">
            <span>&larr;</span> Kembali ke Beranda
          </Link>
          
          <div className="login-header">
            <h1>Selamat Datang</h1>
            <p>Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username atau Email</label>
              <input 
                type="text" 
                id="username" 
                className="form-input" 
                placeholder="Masukkan username Anda" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                placeholder="Masukkan password Anda" 
                required 
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-group">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="footer-link">Lupa password?</a>
            </div>
            
            <button type="submit" className="btn-primary btn-full">
              Masuk
            </button>
          </form>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-branding">
          <h2>SIMASIP JU 2</h2>
          <p>Sistem Manajemen Arsip Terintegrasi dan Aman. Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara.</p>
        </div>
      </div>
    </div>
  );
}

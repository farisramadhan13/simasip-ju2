"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const session = await getSession();
        if (session?.user?.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard-user");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem, silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

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

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email / ID Pengguna</label>
              <input 
                type="text" 
                id="email" 
                className="form-input" 
                placeholder="Masukkan email Anda" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-group">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="footer-link">Lupa password?</a>
            </div>
            
            <button type="submit" className={`btn-primary btn-full ${isLoading ? 'btn-loading' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner spinner-small" style={{ borderLeftColor: '#fff' }}></div>
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk"
              )}
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

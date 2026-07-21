"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (status === "loading") {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-text">Memverifikasi Sesi...</div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-highlight">SIMASIP</span> JU 2
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="nav-item-icon">📊</span>
            Beranda
          </Link>
          <Link href="/dashboard/arsip" className={`nav-item ${pathname?.includes('/arsip') ? 'active' : ''}`}>
            <span className="nav-item-icon">📁</span>
            Manajemen Arsip
          </Link>
          
          {user?.role === 'admin' && (
            <Link href="/dashboard/pengguna" className={`nav-item ${pathname?.includes('/pengguna') ? 'active' : ''}`}>
              <span className="nav-item-icon">👥</span>
              Pengguna
            </Link>
          )}
          
          <Link href="/dashboard/pengaturan" className={`nav-item ${pathname?.includes('/pengaturan') ? 'active' : ''}`}>
            <span className="nav-item-icon">⚙️</span>
            Pengaturan
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button 
            className="mobile-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          
          <div style={{ flex: 1 }}></div>

          <div className="header-user">
            <div className="user-info">
              <div className="user-name">{user?.name || 'Pengguna'}</div>
              <div className="user-role">{user?.position || user?.role || 'Admin'}</div>
            </div>
            <div className="avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="btn-secondary" 
              style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', marginLeft: '1rem' }}
            >
              Keluar
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

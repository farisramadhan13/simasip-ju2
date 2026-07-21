import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="page-title">Beranda</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Arsip</h3>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-icon icon-purple">
            📁
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <h3>Arsip Terbaru</h3>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-icon icon-yellow">
            📄
          </div>
        </div>
        
        {session?.user?.role === 'admin' && (
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Pengguna</h3>
              <div className="stat-value">1</div>
            </div>
            <div className="stat-icon icon-purple">
              👥
            </div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Selamat datang kembali, {session?.user?.name}!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Anda login sebagai <strong>{session?.user?.position}</strong> ({session?.user?.role === 'admin' ? 'Administrator' : 'Pengguna Standar'}).
          Saat ini sistem manajemen arsip siap digunakan. Anda dapat mulai mengunggah, mencari, dan mengelola dokumen arsip Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara melalui menu di sebelah kiri.
        </p>
      </div>
    </div>
  );
}

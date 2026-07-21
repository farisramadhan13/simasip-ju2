import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardUserPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="page-title">Beranda User</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Arsip Saya</h3>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-icon icon-purple">
            📁
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <h3>Menunggu Persetujuan</h3>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-icon icon-yellow">
            ⏳
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Halo, {session?.user?.name}!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Anda login sebagai <strong>{session?.user?.position}</strong> di unit <strong>{session?.user?.unit}</strong>.
          Selamat datang di halaman dasbor pribadi Anda. Anda dapat melihat, mengunggah, dan mencari riwayat arsip yang telah Anda tangani melalui menu di sebelah kiri.
        </p>
      </div>
    </div>
  );
}

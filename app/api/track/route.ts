import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nomorSurat = searchParams.get("nomorSurat");

  if (!nomorSurat) {
    return NextResponse.json({ message: "Nomor surat diperlukan" }, { status: 400 });
  }

  try {
    // Cari di tabel Surat Masuk
    const suratMasuk = await prisma.suratMasuk.findFirst({
      where: { nomorSurat: { equals: nomorSurat, mode: 'insensitive' } }
    });

    if (suratMasuk) {
      return NextResponse.json({
        type: "Surat Masuk",
        data: {
          nomorSurat: suratMasuk.nomorSurat,
          perihal: suratMasuk.perihal,
          tanggal: suratMasuk.tanggalPenerimaan,
          pengelola: suratMasuk.bidangPengelola,
          status: suratMasuk.status,
          keterangan: suratMasuk.keterangan || "Tidak ada keterangan tambahan",
          catatan: suratMasuk.catatan
        }
      });
    }

    // Cari di tabel Surat Keluar
    const suratKeluar = await prisma.suratKeluar.findFirst({
      where: { nomorSurat: { equals: nomorSurat, mode: 'insensitive' } }
    });

    if (suratKeluar) {
      return NextResponse.json({
        type: "Surat Keluar",
        data: {
          nomorSurat: suratKeluar.nomorSurat,
          perihal: suratKeluar.perihal,
          tanggal: suratKeluar.tanggalKeluar,
          pengelola: suratKeluar.ditujukan, // "Ditujukan Kepada" as context
          status: suratKeluar.status,
          keterangan: suratKeluar.keterangan || "Tidak ada keterangan tambahan",
          catatan: "-"
        }
      });
    }

    // Cari di tabel Disposisi
    const disposisi = await prisma.disposisi.findFirst({
      where: { nomorSurat: { equals: nomorSurat, mode: 'insensitive' } }
    });

    if (disposisi) {
      return NextResponse.json({
        type: "Disposisi",
        data: {
          nomorSurat: disposisi.nomorSurat,
          perihal: disposisi.perihal,
          tanggal: disposisi.tanggalPenerimaan,
          pengelola: disposisi.bidangPengelola,
          status: disposisi.status,
          keterangan: disposisi.keterangan || "Tidak ada keterangan tambahan",
          catatan: "-"
        }
      });
    }

    // Jika tidak ditemukan di ketiga tabel
    return NextResponse.json({ message: "Surat tidak ditemukan" }, { status: 404 });

  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

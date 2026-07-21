import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const disposisi = await prisma.disposisi.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(disposisi);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data disposisi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    
    // Konversi string tanggal ke Date object
    if (data.tanggalPenerimaan) data.tanggalPenerimaan = new Date(data.tanggalPenerimaan);
    if (data.tanggalSurat) data.tanggalSurat = new Date(data.tanggalSurat);
    if (data.tanggalDisposisi) data.tanggalDisposisi = new Date(data.tanggalDisposisi);
    if (data.tanggalMasukSeksi) data.tanggalMasukSeksi = new Date(data.tanggalMasukSeksi);

    const disposisi = await prisma.disposisi.create({
      data: {
        nomorUrut: data.nomorUrut,
        tanggalPenerimaan: data.tanggalPenerimaan,
        nomorSurat: data.nomorSurat,
        tanggalSurat: data.tanggalSurat,
        sasaran: data.sasaran,
        perihal: data.perihal,
        fileSuratUrl: data.fileSuratUrl,
        fileDisposisiUrl: data.fileDisposisiUrl,
        bidangPengelola: data.bidangPengelola,
        tanggalDisposisi: data.tanggalDisposisi,
        disposisiPimpinan: data.disposisiPimpinan,
        tanggalMasukSeksi: data.tanggalMasukSeksi,
        nomorUrutSeksi: data.nomorUrutSeksi,
        petugas: data.petugas,
        keterangan: data.keterangan,
        status: data.status || "belum diproses"
      }
    });

    return NextResponse.json(disposisi, { status: 201 });
  } catch (error) {
    console.error("POST Disposisi Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan disposisi" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await prisma.suratMasuk.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data surat masuk" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    
    if (data.tanggalPenerimaan) data.tanggalPenerimaan = new Date(data.tanggalPenerimaan);
    if (data.tanggalSurat) data.tanggalSurat = new Date(data.tanggalSurat);
    if (data.tanggalDisposisi) data.tanggalDisposisi = new Date(data.tanggalDisposisi);
    if (data.tanggalMasukSeksi) data.tanggalMasukSeksi = new Date(data.tanggalMasukSeksi);

    const result = await prisma.suratMasuk.create({
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
        catatan: data.catatan || "-",
        status: data.status || "Menunggu Disposisi"
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST Surat Masuk Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan surat masuk" }, { status: 500 });
  }
}

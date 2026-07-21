import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    const data = await req.json();

    if (data.tanggalPenerimaan) data.tanggalPenerimaan = new Date(data.tanggalPenerimaan);
    if (data.tanggalSurat) data.tanggalSurat = new Date(data.tanggalSurat);
    if (data.tanggalDisposisi) data.tanggalDisposisi = new Date(data.tanggalDisposisi);
    if (data.tanggalMasukSeksi) data.tanggalMasukSeksi = new Date(data.tanggalMasukSeksi);

    const updated = await prisma.suratMasuk.update({
      where: { id },
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
        catatan: data.catatan,
        status: data.status
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui surat masuk" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    await prisma.suratMasuk.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus surat masuk" }, { status: 500 });
  }
}

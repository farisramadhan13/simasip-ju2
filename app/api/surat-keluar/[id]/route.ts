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

    if (data.tanggalKeluar) data.tanggalKeluar = new Date(data.tanggalKeluar);

    const updated = await prisma.suratKeluar.update({
      where: { id },
      data: {
        nomorUrut: data.nomorUrut,
        tanggalKeluar: data.tanggalKeluar,
        nomorSurat: data.nomorSurat,
        perihal: data.perihal,
        ditujukan: data.ditujukan,
        tembusan: data.tembusan,
        keterangan: data.keterangan,
        fileSuratUrl: data.fileSuratUrl,
        petugas: data.petugas,
        status: data.status
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui surat keluar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  try {
    await prisma.suratKeluar.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus surat keluar" }, { status: 500 });
  }
}

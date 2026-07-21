import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await prisma.suratKeluar.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data surat keluar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    
    if (data.tanggalKeluar) data.tanggalKeluar = new Date(data.tanggalKeluar);

    const result = await prisma.suratKeluar.create({
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
        status: data.status || "Draft"
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST Surat Keluar Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan surat keluar" }, { status: 500 });
  }
}

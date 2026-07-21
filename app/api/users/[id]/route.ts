import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const data = await req.json();
    const { name, email, password, position, unit, role } = data;

    if (!name || !email || !position || !unit || !role) {
      return NextResponse.json({ message: "Data utama tidak boleh kosong" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah digunakan oleh pengguna lain" }, { status: 400 });
    }

    const updateData: any = { name, email, position, unit, role };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui pengguna" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;

  if (session.user.id === id) {
    return NextResponse.json({ message: "Anda tidak dapat menghapus akun Anda sendiri" }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus pengguna" }, { status: 500 });
  }
}

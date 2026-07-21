import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    // Check if an admin already exists to prevent duplicate seeding
    const existingAdmin = await prisma.user.findFirst({
      where: { email: "admin@simasip.ju2" },
    });

    if (!existingAdmin) {
      // Hash the default password
      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create the initial admin user
      await prisma.user.create({
        data: {
          name: "Administrator Sistem",
          position: "Kepala Admin",
          unit: "Suku Dinas Pendidikan Wil. II JU",
          email: "admin@simasip.ju2",
          password: hashedPassword,
          role: "admin",
        },
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: "radenfarisramadhan13@gmail.com" },
    });

    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash("@Rbu_12345", 10);
      await prisma.user.create({
        data: {
          name: "Faris Ramadhan",
          position: "Staf",
          unit: "Subbag TU Sudin",
          email: "radenfarisramadhan13@gmail.com",
          password: hashedUserPassword,
          role: "user",
        },
      });
    }

    return NextResponse.json({
      message: "Setup completed! Users are ready.",
    });
  } catch (error) {
    console.error("Error creating initial admin:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

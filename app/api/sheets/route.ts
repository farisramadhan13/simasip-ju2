import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Hapus cache agar API selalu mengembalikan data terbaru saat dipanggil (Revalidate = 0)
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Setup Autentikasi dengan Service Account
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Penting: Mengganti \n di string menjadi newline asli
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // 2. Kumpulkan ID dari env
    const sheetIds = [
      process.env.SHEET_ID_1,
      process.env.SHEET_ID_2,
      process.env.SHEET_ID_3,
    ].filter(Boolean); // Buang yang kosong (undefined/null)

    const allSheetsData = [];

    // 3. Looping untuk mengambil data dari masing-masing Sheet
    for (const [index, id] of sheetIds.entries()) {
      if (!id) continue;
      
      const doc = new GoogleSpreadsheet(id as string, serviceAccountAuth);
      
      // Load informasi dasar dokumen
      await doc.loadInfo(); 
      
      // Ambil tab pertama (Sheet1)
      const sheet = doc.sheetsByIndex[0]; 
      
      // Atur baris header (judul kolom) berdasarkan urutan sheet
      // index 0 = Surat Masuk, index 1 = Surat Keluar, index 2 = Disposisi
      if (index === 2) {
        await sheet.loadHeaderRow(1); // Disposisi mulai dari A1
      } else {
        await sheet.loadHeaderRow(6); // Surat Masuk & Keluar mulai dari A6
      }
      
      // Ambil semua baris data (otomatis membaca data mulai dari bawah header)
      const rows = await sheet.getRows();
      
      // Ubah data baris menjadi format object JSON
      const formattedData = rows.map((row) => row.toObject());

      allSheetsData.push({
        id: `sheet-${index + 1}`,
        title: doc.title,
        data: formattedData,
      });
    }

    return NextResponse.json({ success: true, results: allSheetsData });
  } catch (error: any) {
    console.error("Terjadi kesalahan saat membaca Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

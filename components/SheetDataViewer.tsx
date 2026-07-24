"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SheetDataViewer() {
  // SWR akan mengambil data secara otomatis dan terus mengecek pembaruan
  const { data, error, isLoading } = useSWR("/api/sheets", fetcher, {
    refreshInterval: 10000, // (Opsional) Cek otomatis setiap 10 detik. Hapus baris ini jika hanya ingin cek saat user kembali ke tab.
    revalidateOnFocus: true, // Akan mengecek data terbaru jika user berpindah tab lalu kembali lagi
  });

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Memuat data dari Google Sheets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        Gagal memuat data dari API. Pastikan Service Account memiliki akses ke Sheet.
      </div>
    );
  }

  if (data?.success === false) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        Error dari Google: {data?.error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {data?.results?.map((sheet: any) => (
        <div
          key={sheet.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
        >
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {sheet.title}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-white text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  {sheet.data.length > 0 &&
                    Object.keys(sheet.data[0]).map((header) => (
                      <th key={header} className="px-6 py-4 font-semibold">
                        {header}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {sheet.data.map((row: any, rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className="bg-white transition-colors hover:bg-blue-50/50 dark:bg-gray-900 dark:hover:bg-blue-900/10"
                  >
                    {Object.values(row).map((cell: any, cellIndex: number) => (
                      <td key={cellIndex} className="whitespace-nowrap px-6 py-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
                {sheet.data.length === 0 && (
                  <tr>
                    <td colSpan={100} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data di sheet ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

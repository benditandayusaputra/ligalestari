import type { SetoranSampah } from '#shared/types'
import { KATEGORI_SAMPAH, adalahKategori } from '#shared/data/kategori-sampah'

/** Transaksi setoran terbaru + tabel tarif per kategori. */
export default defineEventHandler(async () => {
  const baris = await kueri(
    (sql) => sql`select waktu, kelas, kategori, kg::float8 as kg, poin
                   from setoran
                  order by dibuat desc
                  limit 30`,
  )

  if (baris?.length) {
    const transaksi: SetoranSampah[] = baris
      .filter((s) => adalahKategori(s.kategori))
      .map((s) => ({ waktu: s.waktu, kelas: s.kelas, kategori: s.kategori, kg: s.kg, poin: s.poin }))
    return { tarif: KATEGORI_SAMPAH, transaksi }
  }

  return { tarif: KATEGORI_SAMPAH, transaksi: demo.setoran }
})

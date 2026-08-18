import type { SetoranSampah } from '#shared/types'
import { KATEGORI_SAMPAH, adalahKategori } from '#shared/data/kategori-sampah'

/** Transaksi setoran terbaru + tabel tarif per kategori. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('setoran')
      .select('waktu, kelas, kategori, kg, poin')
      .order('dibuat', { ascending: false })
      .limit(30)
    if (!error && data?.length) {
      const transaksi: SetoranSampah[] = data
        .filter((s) => adalahKategori(s.kategori))
        .map((s) => ({
          waktu: s.waktu,
          kelas: s.kelas,
          kategori: s.kategori,
          kg: Number(s.kg),
          poin: s.poin,
        }))
      return { tarif: KATEGORI_SAMPAH, transaksi }
    }
  }
  return { tarif: KATEGORI_SAMPAH, transaksi: db.setoran }
})

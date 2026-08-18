import { LAPORAN_BULANAN, LAPORAN_SPESIES } from '#shared/data/admin'
import { DAFTAR_KATEGORI, KATEGORI_SAMPAH } from '#shared/data/kategori-sampah'
import { DAMPAK, KOMPOSISI_LIGA, MUSIM } from '#shared/data/klasemen'

/** Komposisi kategori liga siap tampil: label, kg, persen, tarif, warna. */
function komposisiLiga() {
  const totalKg = DAFTAR_KATEGORI.reduce((a, k) => a + KOMPOSISI_LIGA[k], 0)
  return DAFTAR_KATEGORI.map((k) => ({
    kategori: k,
    label: KATEGORI_SAMPAH[k].label,
    tarif: KATEGORI_SAMPAH[k].tarif,
    warna: KATEGORI_SAMPAH[k].warna,
    kg: KOMPOSISI_LIGA[k],
    persen: Math.round((KOMPOSISI_LIGA[k] / totalKg) * 100),
  }))
}

/** Bahan laporan dampak Adiwiyata musim berjalan. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const [musim, tim, bulanan, spesies] = await Promise.all([
      sb.from('musim').select('nama').eq('id', 1).maybeSingle(),
      sb.from('tim').select('kg, pohon, co2'),
      sb.from('laporan_bulanan').select('bulan, kg').order('urutan'),
      sb.from('laporan_spesies').select('nama, jumlah, co2, persen, warna').order('urutan'),
    ])
    if (!musim.error && musim.data && !tim.error && tim.data && !bulanan.error && !spesies.error) {
      return {
        musim: musim.data.nama as string,
        total: {
          sampahKg: tim.data.reduce((a, t) => a + t.kg, 0),
          pohon: tim.data.reduce((a, t) => a + t.pohon, 0),
          co2Kg: tim.data.reduce((a, t) => a + t.co2, 0),
        },
        bulanan: bulanan.data ?? [],
        spesies: spesies.data ?? [],
        // Agregat per kategori memakai data demo sampai tabelnya tersedia.
        komposisi: komposisiLiga(),
      }
    }
  }
  return {
    musim: MUSIM.nama,
    total: DAMPAK,
    bulanan: LAPORAN_BULANAN,
    spesies: LAPORAN_SPESIES,
    komposisi: komposisiLiga(),
  }
})

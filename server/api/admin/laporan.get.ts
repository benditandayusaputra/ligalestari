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
  const hasil = await kueri(async (sql) => {
    const [musim, total, bulanan, spesies] = await Promise.all([
      sql`select nama from musim where id = 1`,
      sql`select coalesce(sum(kg), 0)::int as sampah_kg,
                 coalesce(sum(pohon), 0)::int as pohon,
                 coalesce(sum(co2), 0)::int as co2_kg
            from tim`,
      sql`select bulan, kg from laporan_bulanan order by urutan`,
      sql`select nama, jumlah, co2, persen, warna from laporan_spesies order by urutan`,
    ])
    return musim.length ? { musim: musim[0]!, total: total[0]!, bulanan, spesies } : null
  })

  if (hasil) {
    return {
      musim: hasil.musim.nama as string,
      total: {
        sampahKg: hasil.total.sampah_kg as number,
        pohon: hasil.total.pohon as number,
        co2Kg: hasil.total.co2_kg as number,
      },
      bulanan: hasil.bulanan,
      spesies: hasil.spesies,
      // Agregat per kategori memakai data demo sampai tabelnya tersedia.
      komposisi: komposisiLiga(),
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

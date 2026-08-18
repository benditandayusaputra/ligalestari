import { KODE_GABUNG, SISWA_PER_KELAS } from '#shared/data/admin'
import { KLASEMEN } from '#shared/data/klasemen'

/** Daftar kelas terdaftar: data tim + jumlah siswa + kode gabung aktif. */
export default defineEventHandler(async () => {
  const baris = await kueri(
    (sql) => sql`select id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren,
                        jumlah_siswa as "jumlahSiswa",
                        coalesce(kode_gabung, '') as kode
                   from tim
                  order by poin desc`,
  )
  if (baris?.length) return { daftar: baris }

  return {
    daftar: KLASEMEN.map((t) => ({
      ...t,
      jumlahSiswa: SISWA_PER_KELAS[t.id] ?? 0,
      kode: KODE_GABUNG[t.id] ?? '',
    })),
  }
})

import type { TimKelas } from '#shared/types'
import { KODE_GABUNG, SISWA_PER_KELAS } from '#shared/data/admin'
import { KLASEMEN } from '#shared/data/klasemen'

/** Daftar kelas terdaftar: data tim + jumlah siswa + kode gabung aktif. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('tim')
      .select('id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren, jumlah_siswa, kode_gabung')
      .order('poin', { ascending: false })
    if (!error && data?.length) {
      return {
        daftar: data.map((t) => ({
          ...(t as unknown as TimKelas),
          jumlahSiswa: t.jumlah_siswa as number,
          kode: (t.kode_gabung ?? '') as string,
        })),
      }
    }
  }

  return {
    daftar: KLASEMEN.map((t) => ({
      ...t,
      jumlahSiswa: SISWA_PER_KELAS[t.id] ?? 0,
      kode: KODE_GABUNG[t.id] ?? '',
    })),
  }
})

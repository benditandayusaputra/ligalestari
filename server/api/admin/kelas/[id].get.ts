import type { TimKelas } from '#shared/types'
import { KODE_GABUNG, SISWA_KELAS, SISWA_PER_KELAS } from '#shared/data/admin'
import { KLASEMEN_PER_ID } from '#shared/data/klasemen'

/** Detail satu kelas: tim, kode gabung, dan daftar siswanya. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''

  const hasil = await kueri(async (sql) => {
    const [tim, siswa] = await Promise.all([
      sql`select id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren,
                 jumlah_siswa as "jumlahSiswa", coalesce(kode_gabung, '') as kode
            from tim
           where id = ${id}`,
      sql`select nama, nis, poin from siswa where kelas_id = ${id} order by poin desc`,
    ])
    return { tim: tim[0] ?? null, siswa }
  })

  if (hasil) {
    if (!hasil.tim) {
      throw createError({ statusCode: 404, statusMessage: 'Kelas tidak ditemukan' })
    }
    return {
      tim: hasil.tim as unknown as TimKelas,
      jumlahSiswa: hasil.tim.jumlahSiswa as number,
      kode: hasil.tim.kode as string,
      siswa: hasil.siswa,
    }
  }

  const tim = KLASEMEN_PER_ID[id]
  if (!tim) {
    throw createError({ statusCode: 404, statusMessage: 'Kelas tidak ditemukan' })
  }
  return {
    tim,
    jumlahSiswa: SISWA_PER_KELAS[id] ?? 0,
    kode: KODE_GABUNG[id] ?? '',
    siswa: SISWA_KELAS,
  }
})

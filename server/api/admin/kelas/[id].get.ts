import type { TimKelas } from '#shared/types'
import { KODE_GABUNG, SISWA_KELAS, SISWA_PER_KELAS } from '#shared/data/admin'
import { KLASEMEN_PER_ID } from '#shared/data/klasemen'

/** Detail satu kelas: tim, kode gabung, dan daftar siswanya. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''

  const sb = pakaiSupabase()
  if (sb) {
    const [tim, siswa] = await Promise.all([
      sb.from('tim').select().eq('id', id).maybeSingle(),
      sb.from('siswa').select('nama, nis, poin').eq('kelas_id', id).order('poin', { ascending: false }),
    ])
    if (!tim.error && !siswa.error) {
      if (!tim.data) {
        throw createError({ statusCode: 404, statusMessage: 'Kelas tidak ditemukan' })
      }
      return {
        tim: tim.data as unknown as TimKelas,
        jumlahSiswa: tim.data.jumlah_siswa as number,
        kode: (tim.data.kode_gabung ?? '') as string,
        siswa: siswa.data ?? [],
      }
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

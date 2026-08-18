import { cariKelas } from '#shared/data/akun-demo'

/** Pengecekan kode gabung kelas (dipakai alur daftar & gabung kelas). */
export default defineEventHandler(async (event) => {
  const { kode } = await readBody<{ kode?: string }>(event)
  if (!kode?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Masukkan kode gabung' })
  }

  const baris = await kueri(
    (sql) => sql`select nama, emblem, warna from tim where kode_gabung = ${kode.trim().toUpperCase()}`,
  )
  if (baris) {
    const tim = baris[0]
    if (!tim) throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
    return { kelas: { nama: tim.nama as string, emblem: tim.emblem as string, warna: tim.warna as string } }
  }

  const kelas = cariKelas(kode)
  if (!kelas) {
    throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
  }
  return { kelas }
})

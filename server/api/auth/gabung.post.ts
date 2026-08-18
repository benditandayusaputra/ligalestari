import { cariKelas } from '#shared/data/akun-demo'

/** Pengecekan kode gabung kelas (dipakai alur daftar & gabung kelas). */
export default defineEventHandler(async (event) => {
  const { kode } = await readBody<{ kode?: string }>(event)
  if (!kode?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Masukkan kode gabung' })
  }

  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('tim')
      .select('nama, emblem, warna')
      .eq('kode_gabung', kode.trim().toUpperCase())
      .maybeSingle()
    if (!error) {
      if (!data) throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
      return { kelas: { nama: data.nama as string, emblem: data.emblem as string, warna: data.warna as string } }
    }
  }

  const kelas = cariKelas(kode)
  if (!kelas) {
    throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
  }
  return { kelas }
})

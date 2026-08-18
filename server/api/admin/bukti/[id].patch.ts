import { BUKTI_TANAM } from '#shared/data/admin'

/** Setujui / tolak bukti tanam; keputusan disimpan ke database. */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const { keputusan } = await readBody<{ keputusan?: 'disetujui' | 'ditolak' }>(event)

  if (keputusan !== 'disetujui' && keputusan !== 'ditolak') {
    throw createError({ statusCode: 400, statusMessage: 'Keputusan tidak valid' })
  }

  // Larik kosong = baris tidak ada; null = database belum siap.
  const diperbarui = await kueri(
    (sql) => sql`update bukti_tanam set keputusan = ${keputusan} where id = ${id} returning id`,
  )
  if (diperbarui) {
    if (!diperbarui.length) {
      throw createError({ statusCode: 404, statusMessage: 'Bukti tidak ditemukan' })
    }
    return { id, keputusan }
  }

  // Fallback memori (database belum dikonfigurasi untuk menulis).
  if (!BUKTI_TANAM.some((b) => b.id === id)) {
    throw createError({ statusCode: 404, statusMessage: 'Bukti tidak ditemukan' })
  }
  demo.keputusanBukti[id] = keputusan
  return { id, keputusan }
})

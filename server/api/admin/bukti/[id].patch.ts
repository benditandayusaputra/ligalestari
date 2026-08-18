import { BUKTI_TANAM } from '#shared/data/admin'

/** Setujui / tolak bukti tanam; keputusan disimpan ke database. */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const { keputusan } = await readBody<{ keputusan?: 'disetujui' | 'ditolak' }>(event)

  if (keputusan !== 'disetujui' && keputusan !== 'ditolak') {
    throw createError({ statusCode: 400, statusMessage: 'Keputusan tidak valid' })
  }

  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('bukti_tanam')
      .update({ keputusan })
      .eq('id', id)
      .select('id')
      .maybeSingle()
    if (!error) {
      if (!data) throw createError({ statusCode: 404, statusMessage: 'Bukti tidak ditemukan' })
      return { id, keputusan }
    }
  }

  // Fallback memori (Supabase belum dikonfigurasi untuk menulis).
  if (!BUKTI_TANAM.some((b) => b.id === id)) {
    throw createError({ statusCode: 404, statusMessage: 'Bukti tidak ditemukan' })
  }
  db.keputusanBukti[id] = keputusan
  return { id, keputusan }
})

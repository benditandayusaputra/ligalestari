import type { EventLiga } from '#shared/types'
import { DAFTAR_EVENT, RATE } from '#shared/data/admin'

/** Daftar event liga beserta rate poin musim berjalan. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb.from('event_liga').select().order('urutan')
    if (!error && data?.length) {
      const daftar: EventLiga[] = data.map((e) => ({
        nama: e.nama,
        jenis: e.jenis,
        rate: e.rate,
        status: e.status,
        periode: e.periode,
      }))
      return { rate: RATE, daftar }
    }
  }
  return { rate: RATE, daftar: DAFTAR_EVENT }
})

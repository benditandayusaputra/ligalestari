import type { EventLiga } from '#shared/types'
import { DAFTAR_EVENT, RATE } from '#shared/data/admin'

/** Daftar event liga beserta rate poin musim berjalan. */
export default defineEventHandler(async () => {
  const baris = await kueri(
    (sql) => sql`select nama, jenis, rate, status, periode from event_liga order by urutan`,
  )
  return { rate: RATE, daftar: (baris?.length ? baris : DAFTAR_EVENT) as EventLiga[] }
})

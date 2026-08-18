import type { BarisArtikel } from '../../utils/petakan'
import { DAFTAR_ARTIKEL } from '#shared/data/artikel'

/** Daftar seluruh artikel edukasi. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb.from('artikel').select().order('tanggal')
    if (!error && data?.length) {
      return { artikel: (data as BarisArtikel[]).map(petaArtikel) }
    }
  }
  return { artikel: DAFTAR_ARTIKEL }
})

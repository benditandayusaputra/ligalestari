import type { Artikel } from '#shared/types'
import type { BarisArtikel } from '../../utils/petakan'
import { artikelTerkait, getArtikel, pilihTerkait } from '#shared/data/artikel'

/** Detail satu artikel beserta artikel terkaitnya. */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''

  const sb = pakaiSupabase()
  if (sb) {
    // Enam artikel — ambil semua sekaligus untuk memilih yang terkait.
    const { data, error } = await sb.from('artikel').select()
    if (!error && data?.length) {
      const semua: Artikel[] = (data as BarisArtikel[]).map(petaArtikel)
      const artikel = semua.find((a) => a.slug === slug)
      if (!artikel) {
        throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
      }
      return { artikel, terkait: pilihTerkait(semua, slug) }
    }
  }

  const artikel = getArtikel(slug)
  if (!artikel) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }
  return { artikel, terkait: artikelTerkait(slug) }
})

import { artikelTerkait, getArtikel, pilihTerkait } from '#shared/data/artikel'

/** Detail satu artikel beserta artikel terkaitnya. */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''

  // Enam artikel, ambil semua sekaligus untuk memilih yang terkait.
  const semua = await ambilArtikel()
  if (semua) {
    const artikel = semua.find((a) => a.slug === slug)
    if (!artikel) {
      throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
    }
    return { artikel, terkait: pilihTerkait(semua, slug) }
  }

  const artikel = getArtikel(slug)
  if (!artikel) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }
  return { artikel, terkait: artikelTerkait(slug) }
})

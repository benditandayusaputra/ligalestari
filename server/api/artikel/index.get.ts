import { DAFTAR_ARTIKEL } from '#shared/data/artikel'

/** Daftar seluruh artikel edukasi. */
export default defineEventHandler(async () => {
  return { artikel: (await ambilArtikel()) ?? DAFTAR_ARTIKEL }
})

import type { SetoranSampah } from '#shared/types'
import { poinSetoran, validasiSetoran } from '#shared/data/kategori-sampah'

/**
 * Catat setoran baru; poin dihitung di server (kg × tarif kategori).
 * Validator dan rumusnya sama persis dengan fallback klien (shared).
 */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  const badan = await readBody<Partial<SetoranSampah>>(event)
  const salah = validasiSetoran(badan)
  if (salah) {
    throw createError({ statusCode: 400, statusMessage: salah })
  }
  const { kelas, kategori, kg } = badan as Pick<SetoranSampah, 'kelas' | 'kategori' | 'kg'>

  const baris: SetoranSampah = {
    waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    kelas,
    kategori,
    kg: Math.round(kg * 10) / 10,
    poin: poinSetoran(kg, kategori),
  }

  const tersimpan = await kueri(
    (sql) => sql`insert into setoran (waktu, kelas, kategori, kg, poin)
                 values (${baris.waktu}, ${baris.kelas}, ${baris.kategori}, ${baris.kg}, ${baris.poin})`,
  )
  if (!tersimpan) demo.setoran.unshift(baris) // fallback memori

  return baris
})

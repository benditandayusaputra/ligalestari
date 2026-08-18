import { jawabanAsisten } from '#shared/data/asisten'

/**
 * Asisten Hijau. Saat ini menjawab dari basis pengetahuan lokal;
 * di sinilah pemanggilan API AI dilakukan pada pengembangan berikutnya.
 */
export default defineEventHandler(async (event) => {
  const { pertanyaan } = await readBody<{ pertanyaan?: string }>(event)
  if (!pertanyaan?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Pertanyaan kosong' })
  }
  return { jawaban: jawabanAsisten(pertanyaan) }
})

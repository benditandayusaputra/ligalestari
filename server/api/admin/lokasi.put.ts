import type { LokasiSekolah } from '#shared/types'

/** Simpan pusat peta sekolah (lat/lng/zoom) yang diatur admin. */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  const { lat, lng, zoom } = await readBody<Partial<LokasiSekolah>>(event)

  const valid =
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180 &&
    typeof zoom === 'number' && Number.isFinite(zoom) && zoom >= 3 && zoom <= 20
  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: 'Koordinat tidak valid' })
  }

  const lokasi: LokasiSekolah = {
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
    zoom: Math.round(zoom * 10) / 10,
  }
  await simpanLokasiSekolah(lokasi)
  return { lokasi }
})

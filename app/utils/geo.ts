import type { LokasiSekolah } from '#shared/types'

/**
 * Ubah posisi skematis titik tanam (x/y % pada denah) menjadi koordinat
 * geografis di sekitar pusat sekolah. Denah dipetakan ke area ±300 × 220 m
 * sehingga saat admin memindah pusat sekolah, seluruh titik ikut pindah —
 * posisi tetap skematis demi privasi, bukan koordinat persis.
 */
export function titikKeKoordinat(x: number, y: number, pusat: LokasiSekolah): { lat: number; lng: number } {
  const LEBAR_M = 300
  const TINGGI_M = 220
  const METER_PER_DERAJAT = 111_320
  const lat = pusat.lat + ((50 - y) / 100) * (TINGGI_M / METER_PER_DERAJAT)
  const lng =
    pusat.lng + ((x - 50) / 100) * (LEBAR_M / (METER_PER_DERAJAT * Math.cos((pusat.lat * Math.PI) / 180)))
  return { lat, lng }
}

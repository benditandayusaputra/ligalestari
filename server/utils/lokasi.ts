import type { LokasiSekolah } from '#shared/types'
import { LOKASI_SEKOLAH_BAWAAN } from '#shared/data/peta'

/**
 * Lokasi sekolah tersimpan di tabel `pengaturan` (kunci `lokasi_sekolah`,
 * nilai JSON). Tanpa Supabase — atau bila tabelnya belum ada — nilai jatuh
 * ke memori proses (`db.lokasiSekolah`) agar demo tetap berfungsi.
 */
export async function ambilLokasiSekolah(): Promise<LokasiSekolah> {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('pengaturan')
      .select('nilai')
      .eq('kunci', 'lokasi_sekolah')
      .maybeSingle()
    const nilai = !error && data?.nilai ? (data.nilai as LokasiSekolah) : null
    if (nilai && Number.isFinite(nilai.lat) && Number.isFinite(nilai.lng)) {
      return { lat: nilai.lat, lng: nilai.lng, zoom: nilai.zoom ?? LOKASI_SEKOLAH_BAWAAN.zoom }
    }
  }
  return db.lokasiSekolah
}

export async function simpanLokasiSekolah(lokasi: LokasiSekolah): Promise<void> {
  db.lokasiSekolah = lokasi
  const sb = pakaiSupabase()
  if (sb) await sb.from('pengaturan').upsert({ kunci: 'lokasi_sekolah', nilai: lokasi }, { onConflict: 'kunci' })
}

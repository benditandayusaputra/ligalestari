import type { LokasiSekolah } from '#shared/types'
import { LOKASI_SEKOLAH_BAWAAN } from '#shared/data/peta'

/**
 * Lokasi sekolah tersimpan di tabel `pengaturan` (kunci `lokasi_sekolah`,
 * nilai JSON). Tanpa database (atau bila kuerinya gagal) nilai jatuh
 * ke memori proses (`demo.lokasiSekolah`) agar demo tetap berfungsi.
 */
export async function ambilLokasiSekolah(): Promise<LokasiSekolah> {
  const baris = await kueri((sql) => sql`select nilai from pengaturan where kunci = 'lokasi_sekolah'`)
  const nilai = baris?.[0]?.nilai as LokasiSekolah | undefined
  if (nilai && Number.isFinite(nilai.lat) && Number.isFinite(nilai.lng)) {
    return { lat: nilai.lat, lng: nilai.lng, zoom: nilai.zoom ?? LOKASI_SEKOLAH_BAWAAN.zoom }
  }
  return demo.lokasiSekolah
}

export async function simpanLokasiSekolah(lokasi: LokasiSekolah): Promise<void> {
  demo.lokasiSekolah = lokasi
  await kueri(
    (sql) => sql`
      insert into pengaturan (kunci, nilai)
        values ('lokasi_sekolah', ${JSON.stringify(lokasi)}::jsonb)
      on conflict (kunci) do update set nilai = excluded.nilai, diubah = now()`,
  )
}

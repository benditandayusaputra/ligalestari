import type { LokasiSekolah, TitikTanam } from '#shared/types'

/**
 * Lokasi sekolah bawaan untuk mode demo: SMK Negeri 26 Jakarta
 * (Jl. Balai Pustaka Baru, Rawamangun, Jakarta Timur), koordinat dari
 * OpenStreetMap. Admin menggantinya lewat panel Lokasi Peta; nilai
 * tersimpan di database.
 */
export const LOKASI_SEKOLAH_BAWAAN: LokasiSekolah = { lat: -6.194564, lng: 106.887387, zoom: 18 }

/**
 * Titik penanaman pada denah sekolah. Posisi bersifat skematis (persen
 * terhadap kanvas denah) untuk menjaga privasi lokasi persis.
 * `kelasId` merujuk ke data tim di `data/klasemen.ts`; `co2` = jumlah ×
 * rate acuan halaman metodologi (Angsana 11,1 · Bungur 10,4 · Mahoni
 * 295,7 kg/pohon/th), dibulatkan. Foto dokumentasi diunggah siswa saat
 * menanam; pada mode demo diisi ilustrasi lokal.
 */
export const TITIK_TANAM: TitikTanam[] = [
  { kelasId: 'rpl', x: 14, y: 24, jumlah: 8, jenisPohon: 'Angsana', co2: 89, tanggal: '12 Feb 2026', foto: '/foto-tanam/tanam-1.svg' },
  { kelasId: 'rpl', x: 40, y: 72, jumlah: 5, jenisPohon: 'Bungur', co2: 52, tanggal: '03 Mar 2026', foto: '/foto-tanam/tanam-2.svg' },
  { kelasId: 'tkj', x: 62, y: 30, jumlah: 6, jenisPohon: 'Angsana', co2: 67, tanggal: '18 Feb 2026', foto: '/foto-tanam/tanam-3.svg' },
  { kelasId: 'tkj', x: 24, y: 58, jumlah: 4, jenisPohon: 'Bungur', co2: 42, tanggal: '27 Feb 2026', foto: '/foto-tanam/tanam-4.svg' },
  { kelasId: 'mm', x: 78, y: 62, jumlah: 7, jenisPohon: 'Angsana', co2: 78, tanggal: '05 Mar 2026', foto: '/foto-tanam/tanam-1.svg' },
  { kelasId: 'mm', x: 52, y: 46, jumlah: 3, jenisPohon: 'Angsana', co2: 33, tanggal: '21 Feb 2026', foto: '/foto-tanam/tanam-2.svg' },
  { kelasId: 'akl', x: 33, y: 34, jumlah: 5, jenisPohon: 'Bungur', co2: 52, tanggal: '09 Mar 2026', foto: '/foto-tanam/tanam-3.svg' },
  { kelasId: 'akl', x: 70, y: 80, jumlah: 4, jenisPohon: 'Angsana', co2: 44, tanggal: '14 Mar 2026', foto: '/foto-tanam/tanam-4.svg' },
  { kelasId: 'dkv', x: 46, y: 18, jumlah: 6, jenisPohon: 'Angsana', co2: 67, tanggal: '16 Feb 2026', foto: '/foto-tanam/tanam-2.svg' },
  { kelasId: 'dkv', x: 18, y: 80, jumlah: 3, jenisPohon: 'Bungur', co2: 31, tanggal: '01 Mar 2026', foto: '/foto-tanam/tanam-1.svg' },
  { kelasId: 'mm', x: 86, y: 34, jumlah: 2, jenisPohon: 'Mahoni', co2: 591, tanggal: '22 Mar 2026', foto: '/foto-tanam/tanam-3.svg' },
]

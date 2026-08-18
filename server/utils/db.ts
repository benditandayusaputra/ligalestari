import type { LokasiSekolah, SetoranSampah } from '#shared/types'
import { SETORAN_HARI_INI } from '#shared/data/admin'
import { LOKASI_SEKOLAH_BAWAAN } from '#shared/data/peta'

/**
 * "Database" memori sementara untuk tahap pengembangan API.
 * Data awal diambil dari data demo di `shared/data` dan perubahan
 * bertahan selama proses server hidup. Akan digantikan database
 * sungguhan (mis. SQLite/Postgres) tanpa mengubah bentuk endpoint.
 */

export interface KelasBaru {
  nama: string
  warna: string
  emblem: string
  tahunAjaran: string
  kode: string
}

export const db = {
  setoran: [...SETORAN_HARI_INI] as SetoranSampah[],
  keputusanBukti: {} as Record<number, 'disetujui' | 'ditolak'>,
  kelasBaru: [] as KelasBaru[],
  lokasiSekolah: { ...LOKASI_SEKOLAH_BAWAAN } as LokasiSekolah,
}

/** Kode gabung acak, mis. "RPL1-7K2M" → awalan + 4 karakter. */
export function buatKode(awalan: string): string {
  const huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const acak = Array.from({ length: 4 }, () => huruf[Math.floor(Math.random() * huruf.length)]).join('')
  return `${awalan.toUpperCase()}-${acak}`
}

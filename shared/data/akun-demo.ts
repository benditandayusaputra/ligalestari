/**
 * Akun & kode kelas untuk MODE DEMO fitur autentikasi.
 * Divalidasi oleh endpoint API server; saat situs berjalan sebagai
 * hosting statis, validator yang sama dipakai sebagai fallback klien.
 */

export type PeranAkun = 'siswa' | 'admin'

export const AKUN_DEMO: { pengguna: string; sandi: string; peran: PeranAkun }[] = [
  { pengguna: 'aditya.p', sandi: 'hijau123', peran: 'siswa' },
  { pengguna: '2231045', sandi: 'hijau123', peran: 'siswa' },
  { pengguna: 'admin', sandi: 'admin123', peran: 'admin' },
]

/** Kode gabung kelas yang dikenali pada mode demo. */
export const KODE_KELAS: Record<string, { nama: string; emblem: string; warna: string }> = {
  'RPL1-7K2M': { nama: 'XII RPL 1', emblem: 'R1', warna: '#4cc38a' },
  'TKJ2-3H9P': { nama: 'XI TKJ 2', emblem: 'G2', warna: '#E6B422' },
  'MM1-5J4Q': { nama: 'X MM 1', emblem: 'E1', warna: '#2D8FE0' },
}

export function validasiAkun(pengguna: string, sandi: string, peran: PeranAkun) {
  return (
    AKUN_DEMO.find(
      (a) => a.pengguna.toLowerCase() === pengguna.trim().toLowerCase() && a.sandi === sandi && a.peran === peran,
    ) ?? null
  )
}

export function cariKelas(kode: string) {
  return KODE_KELAS[kode.trim().toUpperCase()] ?? null
}

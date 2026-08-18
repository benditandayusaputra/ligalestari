import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

export type Sql = NeonQueryFunction<false, false>

let klien: Sql | null | undefined

/**
 * Klien Neon (Postgres) sisi server: singleton per proses.
 * Kueri dikirim lewat HTTP driver Neon sehingga tidak menahan koneksi
 * TCP; cocok untuk fungsi serverless yang hidup singkat.
 *
 * Mengembalikan null bila DATABASE_URL belum diisi, pemanggil wajib
 * jatuh ke data demo lokal agar situs tetap berfungsi (termasuk saat
 * `nuxt generate` untuk pengumpulan lomba).
 */
export function pakaiDb(): Sql | null {
  if (klien !== undefined) return klien
  // runtimeConfig lebih dulu (bisa ditimpa NUXT_DATABASE_URL saat jalan);
  // process.env dipakai bila host hanya menyediakan DATABASE_URL setelah build.
  const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
  klien = url ? neon(url) : null
  return klien
}

/**
 * Bungkus satu kueri: hasilnya dikembalikan apa adanya, atau null bila
 * database belum dikonfigurasi ATAU kuerinya gagal. Endpoint cukup
 * menulis `(await kueri(…)) ?? DATA_DEMO` tanpa try/catch berulang.
 *
 * Karena galat ditelan di sini, JANGAN memanggil `createError` di dalam
 * callback: putuskan 404/403 setelah hasilnya kembali.
 */
export async function kueri<T>(jalan: (sql: Sql) => Promise<T>): Promise<T | null> {
  const sql = pakaiDb()
  if (!sql) return null
  try {
    return await jalan(sql)
  } catch (galat) {
    console.error('[db] kueri gagal:', galat)
    return null
  }
}

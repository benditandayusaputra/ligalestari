/**
 * Migrasi database LigaLestari ke Neon (Postgres).
 * Jalankan dari akar proyek: `npm run db:migrate`
 *
 * Urutannya: db/schema.sql → db/seed.sql → akun demo (sandi di-hash).
 * PERHATIAN: skrip ini membangun ulang skema dari nol, seluruh isi
 * tabel LigaLestari yang ada akan terhapus.
 *
 * Kredensial diambil dari DATABASE_URL (env proses atau berkas .env).
 */
import { readFileSync, existsSync } from 'node:fs'
import { Client } from '@neondatabase/serverless'
import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'

/** Baca .env sederhana, cukup untuk KUNCI=nilai satu baris. */
function bacaEnv(berkas = '.env') {
  if (!existsSync(berkas)) return {}
  return Object.fromEntries(
    readFileSync(berkas, 'utf8')
      .split('\n')
      .filter((b) => b.includes('=') && !b.trim().startsWith('#'))
      .map((b) => [b.slice(0, b.indexOf('=')).trim(), b.slice(b.indexOf('=') + 1).trim()]),
  )
}

const url = process.env.DATABASE_URL || bacaEnv().DATABASE_URL
if (!url) {
  console.error('DATABASE_URL belum diisi. Salin .env.example → .env lalu isi URL Neon.')
  process.exit(1)
}

/**
 * Akun demo. Sandi di-hash dengan scrypt memakai setelan bawaan yang
 * sama dengan `hashPassword()` nuxt-auth-utils, sehingga hasilnya bisa
 * diverifikasi langsung oleh endpoint /api/auth/masuk.
 */
const AKUN = [
  { pengguna: 'aditya.p', sandi: 'hijau123', nama: 'Aditya Pratama', peran: 'siswa', kelas: 'rpl', nis: 'NIS 2231045' },
  { pengguna: 'admin', sandi: 'admin123', nama: 'Admin Bank Sampah', peran: 'admin', kelas: null, nis: null },
]

const klien = new Client(url)
await klien.connect()

try {
  await klien.query('begin')

  console.log('→ skema   : db/schema.sql')
  await klien.query(readFileSync(new URL('schema.sql', import.meta.url), 'utf8'))

  console.log('→ seed    : db/seed.sql')
  await klien.query(readFileSync(new URL('seed.sql', import.meta.url), 'utf8'))

  const hash = new Hash(new Scrypt({}))
  for (const a of AKUN) {
    await klien.query(
      `insert into profil (pengguna, nama, peran, sandi_hash, kelas_id, siswa_id)
       values ($1, $2, $3, $4, $5, (select id from siswa where nis = $6))`,
      [a.pengguna, a.nama, a.peran, await hash.make(a.sandi), a.kelas, a.nis],
    )
    console.log(`→ akun    : ${a.pengguna} (${a.peran})`)
  }

  await klien.query('commit')
} catch (galat) {
  await klien.query('rollback')
  console.error('Migrasi gagal, seluruh perubahan dibatalkan:\n', galat)
  process.exit(1)
} finally {
  await klien.end()
}

console.log('\nMigrasi selesai. Masuk sebagai aditya.p/hijau123 (siswa) atau admin/admin123 (admin).')

/**
 * Seed user demo ke Supabase Auth + tabel profil.
 * Jalankan sekali dari akar proyek: `node supabase/seed-auth.mjs`
 * (butuh SUPABASE_URL & SUPABASE_SERVICE_KEY di .env).
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter((b) => b.includes('=') && !b.trim().startsWith('#'))
    .map((b) => [b.slice(0, b.indexOf('=')).trim(), b.slice(b.indexOf('=') + 1).trim()]),
)

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

const DEMO = [
  { pengguna: 'aditya.p', sandi: 'hijau123', nama: 'Aditya Pratama', peran: 'siswa', kelas_id: 'rpl', siswa_id: 1 },
  { pengguna: 'admin', sandi: 'admin123', nama: 'Admin Bank Sampah', peran: 'admin', kelas_id: null, siswa_id: null },
]

for (const d of DEMO) {
  const email = `${d.pengguna}@ligalestari.local`
  let id
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password: d.sandi,
    email_confirm: true,
    user_metadata: { nama: d.nama, peran: d.peran },
  })
  if (error) {
    // Kemungkinan sudah ada dari eksekusi sebelumnya — cari id-nya.
    const { data: daftar, error: eDaftar } = await sb.auth.admin.listUsers({ perPage: 200 })
    id = daftar?.users.find((u) => u.email === email)?.id
    if (!id) throw eDaftar ?? error
  } else {
    id = data.user.id
  }

  const { error: eProfil } = await sb.from('profil').upsert({
    id,
    pengguna: d.pengguna,
    nama: d.nama,
    peran: d.peran,
    kelas_id: d.kelas_id,
    siswa_id: d.siswa_id,
  })
  if (eProfil) throw eProfil
  console.log(`OK  ${d.pengguna} → ${id}`)
}

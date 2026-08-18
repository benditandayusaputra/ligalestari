import { cariKelas } from '#shared/data/akun-demo'

/** Kode unique_violation Postgres, username sudah dipakai. */
const SUDAH_ADA = '23505'

/**
 * Pendaftaran siswa: buat baris `siswa` + `profil` (sandi di-hash) dan
 * naikkan jumlah siswa kelasnya, lalu langsung masukkan ke sesi.
 * Kode kelas menentukan timnya.
 */
export default defineEventHandler(async (event) => {
  const { nama, pengguna, sandi, kode } = await readBody<{
    nama?: string
    pengguna?: string
    sandi?: string
    kode?: string
  }>(event)

  if (!nama?.trim() || !pengguna?.trim() || !sandi || !kode?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Lengkapi semua kolom wajib' })
  }
  if (sandi.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 6 karakter' })
  }

  const idPengguna = pengguna.trim().toLowerCase()
  const namaBersih = nama.trim()
  const nis = /^\d+$/.test(idPengguna) ? `NIS ${idPengguna}` : idPengguna

  const sql = pakaiDb()
  if (sql) {
    try {
      const [tim] = await sql`select id, nama, emblem, warna from tim
                               where kode_gabung = ${kode.trim().toUpperCase()}`
      if (!tim) {
        throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
      }

      // Siswa, profil, dan penambah jumlah siswa dijalankan sebagai SATU
      // pernyataan (CTE) supaya tidak ada akun setengah jadi bila gagal.
      await sql`
        with s as (
          insert into siswa (kelas_id, nama, nis) values (${tim.id}, ${namaBersih}, ${nis})
          returning id
        ), p as (
          insert into profil (pengguna, nama, peran, sandi_hash, kelas_id, siswa_id)
          select ${idPengguna}, ${namaBersih}, 'siswa', ${await hashPassword(sandi)}, ${tim.id}, s.id
            from s
          returning id
        )
        update tim set jumlah_siswa = jumlah_siswa + 1 where id = ${tim.id}`

      await setUserSession(event, {
        user: { pengguna: idPengguna, nama: namaBersih, peran: 'siswa', kelasId: tim.id },
      })
      return { kelas: { nama: tim.nama as string, emblem: tim.emblem as string, warna: tim.warna as string } }
    } catch (galat) {
      if ((galat as { code?: string }).code === SUDAH_ADA) {
        throw createError({ statusCode: 409, statusMessage: 'Username sudah dipakai' })
      }
      // Galat bisnis (404 di atas) diteruskan apa adanya; sisanya berarti
      // database bermasalah sehingga alur jatuh ke fallback demo.
      if ((galat as { statusCode?: number }).statusCode) throw galat
      console.error('[db] pendaftaran gagal:', galat)
    }
  }

  // Fallback demo: cocokkan kode terhadap data lokal.
  const kelas = cariKelas(kode)
  if (!kelas) {
    throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
  }
  await setUserSession(event, { user: { pengguna: idPengguna, nama: namaBersih, peran: 'siswa', kelasId: 'rpl' } })
  return { kelas }
})

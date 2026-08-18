import { cariKelas } from '#shared/data/akun-demo'

/**
 * Pendaftaran siswa: buat user Supabase Auth + baris siswa + profil,
 * lalu langsung masukkan ke sesi. Kode kelas menentukan timnya.
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

  const sb = kunciRahasiaAktif() ? pakaiSupabase() : null
  if (sb) {
    const { data: tim, error: eTim } = await sb
      .from('tim')
      .select('id, nama, emblem, warna, jumlah_siswa')
      .eq('kode_gabung', kode.trim().toUpperCase())
      .maybeSingle()
    if (!eTim && !tim) {
      throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
    }

    if (tim) {
      const { data: sudahAda } = await sb.from('profil').select('id').eq('pengguna', idPengguna).maybeSingle()
      if (sudahAda) {
        throw createError({ statusCode: 409, statusMessage: 'Username sudah dipakai' })
      }

      const { data: baru, error: eAuth } = await sb.auth.admin.createUser({
        email: emailDari(idPengguna),
        password: sandi,
        email_confirm: true,
        user_metadata: { nama: nama.trim(), peran: 'siswa' },
      })
      if (eAuth || !baru.user) {
        if (eAuth?.code === 'email_exists') {
          throw createError({ statusCode: 409, statusMessage: 'Username sudah dipakai' })
        }
        throw createError({ statusCode: 500, statusMessage: 'Gagal membuat akun' })
      }

      const { data: siswa } = await sb
        .from('siswa')
        .insert({
          kelas_id: tim.id,
          nama: nama.trim(),
          nis: /^\d+$/.test(idPengguna) ? `NIS ${idPengguna}` : idPengguna,
        })
        .select('id')
        .single()

      await sb.from('profil').insert({
        id: baru.user.id,
        pengguna: idPengguna,
        nama: nama.trim(),
        peran: 'siswa',
        kelas_id: tim.id,
        siswa_id: siswa?.id ?? null,
      })
      await sb.from('tim').update({ jumlah_siswa: tim.jumlah_siswa + 1 }).eq('id', tim.id)

      await setUserSession(event, {
        user: { pengguna: idPengguna, nama: nama.trim(), peran: 'siswa', kelasId: tim.id },
      })
      return { kelas: { nama: tim.nama as string, emblem: tim.emblem as string, warna: tim.warna as string } }
    }
  }

  // Fallback demo: cocokkan kode terhadap data lokal.
  const kelas = cariKelas(kode)
  if (!kelas) {
    throw createError({ statusCode: 404, statusMessage: 'Kode gabung kelas tidak ditemukan' })
  }
  await setUserSession(event, { user: { pengguna: idPengguna, nama: nama.trim(), peran: 'siswa', kelasId: 'rpl' } })
  return { kelas }
})

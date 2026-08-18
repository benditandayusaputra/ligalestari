import { createClient } from '@supabase/supabase-js'
import { validasiAkun, type PeranAkun } from '#shared/data/akun-demo'

const PESAN_SALAH = 'Username atau password salah'

/**
 * Masuk: username/NIS dicari di tabel profil, lalu kata sandi
 * diverifikasi Supabase Auth. Sesi disimpan di cookie terenkripsi.
 */
export default defineEventHandler(async (event) => {
  const { pengguna, sandi, peran } = await readBody<{ pengguna?: string; sandi?: string; peran?: PeranAkun }>(event)
  if (!pengguna?.trim() || !sandi || !peran) {
    throw createError({ statusCode: 400, statusMessage: 'Lengkapi username dan password' })
  }

  // Pencarian profil butuh kunci rahasia (tabel tertutup untuk kunci publik).
  const sb = kunciRahasiaAktif() ? pakaiSupabase() : null
  if (sb) {
    // Cari berdasarkan username; bila tidak ada, coba sebagai NIS siswa.
    let { data: profil } = await sb
      .from('profil')
      .select('pengguna, nama, peran, kelas_id')
      .eq('pengguna', pengguna.trim().toLowerCase())
      .maybeSingle()
    if (!profil) {
      const { data: siswa } = await sb.from('siswa').select('id').eq('nis', `NIS ${pengguna.trim()}`).maybeSingle()
      if (siswa) {
        ;({ data: profil } = await sb
          .from('profil')
          .select('pengguna, nama, peran, kelas_id')
          .eq('siswa_id', siswa.id)
          .maybeSingle())
      }
    }
    if (!profil || profil.peran !== peran) {
      throw createError({ statusCode: 401, statusMessage: PESAN_SALAH })
    }

    // Verifikasi kata sandi lewat Supabase Auth (klien kunci publik).
    const config = useRuntimeConfig(event)
    const auth = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
      auth: { persistSession: false },
    })
    const { error } = await auth.auth.signInWithPassword({ email: emailDari(profil.pengguna), password: sandi })
    if (error) {
      throw createError({ statusCode: 401, statusMessage: PESAN_SALAH })
    }

    await setUserSession(event, {
      user: { pengguna: profil.pengguna, nama: profil.nama, peran: profil.peran, kelasId: profil.kelas_id ?? undefined },
    })
    return { pengguna: profil.pengguna, peran: profil.peran }
  }

  // Fallback demo (Supabase belum dikonfigurasi).
  const akun = validasiAkun(pengguna, sandi, peran)
  if (!akun) {
    throw createError({ statusCode: 401, statusMessage: PESAN_SALAH })
  }
  await setUserSession(event, {
    user: { pengguna: akun.pengguna, nama: akun.pengguna, peran: akun.peran, kelasId: akun.peran === 'siswa' ? 'rpl' : undefined },
  })
  return { pengguna: akun.pengguna, peran: akun.peran }
})

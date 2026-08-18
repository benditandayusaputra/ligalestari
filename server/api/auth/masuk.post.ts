import { validasiAkun, type PeranAkun } from '#shared/data/akun-demo'

const PESAN_SALAH = 'Username atau password salah'

/**
 * Masuk: username/NIS dicocokkan ke tabel `profil`, lalu kata sandi
 * diverifikasi terhadap hash scrypt. Sesi disimpan di cookie terenkripsi.
 */
export default defineEventHandler(async (event) => {
  const { pengguna, sandi, peran } = await readBody<{ pengguna?: string; sandi?: string; peran?: PeranAkun }>(event)
  if (!pengguna?.trim() || !sandi || !peran) {
    throw createError({ statusCode: 400, statusMessage: 'Lengkapi username dan password' })
  }

  const idPengguna = pengguna.trim().toLowerCase()

  // Satu kueri melayani dua cara masuk: username profil atau NIS siswa.
  const baris = await kueri(
    (sql) => sql`select p.pengguna, p.nama, p.peran, p.kelas_id, p.sandi_hash
                   from profil p
                   left join siswa s on s.id = p.siswa_id
                  where p.pengguna = ${idPengguna} or s.nis = ${`NIS ${idPengguna}`}
                  limit 1`,
  )

  if (baris) {
    const profil = baris[0]
    // Peran dicek bersama sandi supaya pesan galatnya tidak membocorkan
    // akun mana yang benar-benar ada.
    if (!profil || profil.peran !== peran || !(await verifyPassword(profil.sandi_hash, sandi))) {
      throw createError({ statusCode: 401, statusMessage: PESAN_SALAH })
    }

    await setUserSession(event, {
      user: {
        pengguna: profil.pengguna,
        nama: profil.nama,
        peran: profil.peran,
        kelasId: profil.kelas_id ?? undefined,
      },
    })
    return { pengguna: profil.pengguna as string, peran: profil.peran as PeranAkun }
  }

  // Fallback demo (database belum dikonfigurasi / tidak terjangkau).
  const akun = validasiAkun(pengguna, sandi, peran)
  if (!akun) {
    throw createError({ statusCode: 401, statusMessage: PESAN_SALAH })
  }
  await setUserSession(event, {
    user: { pengguna: akun.pengguna, nama: akun.pengguna, peran: akun.peran, kelasId: akun.peran === 'siswa' ? 'rpl' : undefined },
  })
  return { pengguna: akun.pengguna, peran: akun.peran }
})

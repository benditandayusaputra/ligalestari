/** Buat kelas baru + hasilkan kode gabungnya. */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  const { nama, warna, emblem, tahunAjaran } = await readBody<{
    nama?: string
    warna?: string
    emblem?: string
    tahunAjaran?: string
  }>(event)

  if (!nama?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Nama kelas wajib diisi' })
  }

  const kelas = {
    nama: nama.trim(),
    warna: warna ?? '#1FA34F',
    emblem: (emblem ?? 'EK').toUpperCase(),
    tahunAjaran: tahunAjaran ?? '2025/2026',
    kode: buatKode((emblem ?? 'EKOL').padEnd(2, 'X')),
  }
  const id = kelas.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const tersimpan = await kueri(
    (sql) => sql`insert into tim (id, nama, julukan, emblem, warna, kode_gabung, tahun_ajaran)
                 values (${id}, ${kelas.nama}, 'Tim Baru', ${kelas.emblem}, ${kelas.warna},
                         ${kelas.kode}, ${kelas.tahunAjaran})`,
  )
  if (!tersimpan) demo.kelasBaru.push(kelas) // fallback memori

  return kelas
})

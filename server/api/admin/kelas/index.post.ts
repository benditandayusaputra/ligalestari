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

  const sb = pakaiSupabase()
  const id = kelas.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const gagalSimpan =
    !sb ||
    (
      await sb.from('tim').insert({
        id,
        nama: kelas.nama,
        julukan: 'Tim Baru',
        emblem: kelas.emblem,
        warna: kelas.warna,
        kode_gabung: kelas.kode,
        tahun_ajaran: kelas.tahunAjaran,
      })
    ).error
  if (gagalSimpan) db.kelasBaru.push(kelas) // fallback memori

  return kelas
})

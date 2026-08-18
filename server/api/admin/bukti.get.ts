import { BUKTI_TANAM, RATE } from '#shared/data/admin'

/** Bukti tanam beserta calon poin dan status keputusannya. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb.from('bukti_tanam').select().order('id')
    if (!error && data?.length) {
      return {
        daftar: data.map((b) => ({
          id: b.id as number,
          kelasId: b.kelas_id as string,
          pohon: b.pohon as number,
          jenisPohon: b.jenis_pohon as string,
          co2: b.co2 as number,
          koordinat: b.koordinat as string,
          lokasi: b.lokasi as string,
          waktu: b.waktu as string,
          calonPoin: (b.pohon as number) * RATE.pohonPerBatang,
          keputusan: (b.keputusan ?? null) as 'disetujui' | 'ditolak' | null,
        })),
      }
    }
  }

  return {
    daftar: BUKTI_TANAM.map((b) => ({
      ...b,
      calonPoin: b.pohon * RATE.pohonPerBatang,
      keputusan: db.keputusanBukti[b.id] ?? null,
    })),
  }
})

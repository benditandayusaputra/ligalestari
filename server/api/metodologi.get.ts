import type { JenisPohon } from '#shared/types'
import { JENIS_POHON, SUMBER_METODOLOGI } from '#shared/data/metodologi'

/** Tabel acuan serapan CO₂ per jenis pohon + daftar rujukan. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('jenis_pohon')
      .select()
      .order('serapan', { ascending: false })
    if (!error && data?.length) {
      const jenisPohon: JenisPohon[] = data.map((p) => ({
        nama: p.nama as string,
        latin: p.latin as string,
        serapan: Number(p.serapan),
        sumber: p.sumber as string,
        warna: p.warna as string,
      }))
      return { jenisPohon, sumber: SUMBER_METODOLOGI }
    }
  }
  return { jenisPohon: JENIS_POHON, sumber: SUMBER_METODOLOGI }
})

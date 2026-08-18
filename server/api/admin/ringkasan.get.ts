import { BUKTI_TANAM, KPI_HARI_INI } from '#shared/data/admin'

/** KPI panel admin — dihitung langsung dari transaksi di database. */
export default defineEventHandler(async () => {
  const sb = pakaiSupabase()
  if (sb) {
    const [setoran, bukti] = await Promise.all([
      sb.from('setoran').select('kg, poin'),
      sb.from('bukti_tanam').select('keputusan'),
    ])
    if (!setoran.error && setoran.data && !bukti.error && bukti.data) {
      return {
        kpi: {
          sampahKg: Math.round(setoran.data.reduce((a, s) => a + Number(s.kg), 0) * 10) / 10,
          transaksi: setoran.data.length,
          poinDibagikan: setoran.data.reduce((a, s) => a + s.poin, 0),
        },
        buktiMenunggu: bukti.data.filter((b) => !b.keputusan).length,
      }
    }
  }
  return {
    kpi: KPI_HARI_INI,
    buktiMenunggu: BUKTI_TANAM.filter((b) => !db.keputusanBukti[b.id]).length,
  }
})

import { BUKTI_TANAM, KPI_HARI_INI } from '#shared/data/admin'

/** KPI panel admin, dihitung langsung dari transaksi di database. */
export default defineEventHandler(async () => {
  const hasil = await kueri(async (sql) => {
    const [setoran, bukti] = await Promise.all([
      sql`select coalesce(round(sum(kg), 1), 0)::float8 as kg,
                 count(*)::int as transaksi,
                 coalesce(sum(poin), 0)::int as poin
            from setoran`,
      sql`select count(*)::int as menunggu from bukti_tanam where keputusan is null`,
    ])
    return { setoran: setoran[0]!, bukti: bukti[0]! }
  })

  if (hasil) {
    return {
      kpi: {
        sampahKg: hasil.setoran.kg as number,
        transaksi: hasil.setoran.transaksi as number,
        poinDibagikan: hasil.setoran.poin as number,
      },
      buktiMenunggu: hasil.bukti.menunggu as number,
    }
  }

  return {
    kpi: KPI_HARI_INI,
    buktiMenunggu: BUKTI_TANAM.filter((b) => !demo.keputusanBukti[b.id]).length,
  }
})

/** Lokasi sekolah tersimpan — untuk formulir Lokasi Peta di panel admin. */
export default defineEventHandler(async (event) => {
  await wajibAdmin(event)
  return { lokasi: await ambilLokasiSekolah() }
})

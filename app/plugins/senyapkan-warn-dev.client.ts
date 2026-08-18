/**
 * Hanya mode pengembangan: senyapkan satu pemberitahuan yang bukan masalah —
 * "<Suspense> is an experimental feature" (dipakai internal Nuxt untuk async
 * setup). Vue mencetaknya lewat console.info mentah, bukan warnHandler, jadi
 * disaring di sini. Pesan lain apa pun tetap lewat, dan di build produksi
 * seluruh pesan dev Vue memang sudah dibuang.
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return
  const infoAsli = console.info.bind(console)
  console.info = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('<Suspense> is an experimental feature')) return
    infoAsli(...args)
  }
})

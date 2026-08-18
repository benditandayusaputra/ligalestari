/**
 * Audit aksesibilitas dan responsif LigaLestari.
 *
 * Dijalankan terhadap build statis (`npm run generate`) karena itulah
 * artefak yang dinilai: seluruh halaman termasuk dasbor dan panel admin
 * bisa dibuka tanpa server sesi.
 *
 *   npm run generate && npm run audit
 *
 * Dua pemeriksaan:
 *   1. axe-core (WCAG 2.1 A + AA) pada tiap halaman di tema gelap & terang.
 *   2. Sapuan 7 viewport untuk mendeteksi gulir mendatar pada tiap halaman.
 *
 * Keluar dengan kode 1 bila ada temuan, supaya bisa dipakai di CI.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const AKAR = '.output/public'
const PORT = 4319

const HALAMAN = [
  '/', '/artikel', '/artikel/memilah-sampah-organik-anorganik', '/peta', '/metodologi',
  '/aturan', '/jadwal', '/mengapa-berbeda', '/kalkulator', '/masuk', '/daftar',
  '/dasbor', '/dasbor/tim', '/dasbor/saya', '/dasbor/notifikasi', '/dasbor/asisten',
  '/admin', '/admin/setoran', '/admin/event', '/admin/verifikasi', '/admin/laporan',
  '/admin/lokasi', '/admin/kelas', '/admin/kelas/baru', '/admin/kelas/rpl',
]

const VIEWPORT = [
  { l: 320, t: 568, nama: 'ponsel kecil' },
  { l: 375, t: 812, nama: 'ponsel modern' },
  { l: 768, t: 1024, nama: 'tablet portrait' },
  { l: 1024, t: 768, nama: 'tablet landscape' },
  { l: 1440, t: 900, nama: 'laptop' },
  { l: 1920, t: 1080, nama: 'Full HD' },
  { l: 2560, t: 1440, nama: 'monitor besar' },
]

const TIPE = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
}

/** Server statis sederhana: cukup untuk menyajikan hasil generate. */
function sajikan() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const bersih = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
      let berkas = join(AKAR, bersih)
      if (existsSync(berkas) && statSync(berkas).isDirectory()) berkas = join(berkas, 'index.html')
      else if (!existsSync(berkas) && existsSync(`${berkas}/index.html`)) berkas = `${berkas}/index.html`
      else if (!existsSync(berkas) && existsSync(`${berkas}.html`)) berkas = `${berkas}.html`
      if (!existsSync(berkas) || statSync(berkas).isDirectory()) {
        res.writeHead(404, { 'content-type': 'text/plain' })
        return res.end('404')
      }
      res.writeHead(200, { 'content-type': TIPE[extname(berkas)] ?? 'application/octet-stream' })
      createReadStream(berkas).pipe(res)
    })
    server.listen(PORT, () => resolve(server))
  })
}

/** Elemen yang menembus lebar layar, untuk menunjuk biang gulir mendatar. */
const CARI_PELUBER = `() => {
  const lebar = document.documentElement.clientWidth
  const nama = (el) => el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '')
  return [...document.querySelectorAll('body *')]
    .filter((el) => el.getBoundingClientRect().right > lebar + 1)
    .slice(0, 4).map(nama)
}`

if (!existsSync(join(AKAR, 'index.html'))) {
  console.error(`Build statis tidak ditemukan di ${AKAR}. Jalankan "npm run generate" lebih dulu.`)
  process.exit(1)
}

const server = await sajikan()
const browser = await chromium.launch()
const dasar = `http://localhost:${PORT}`

const pelanggaran = []
const peluber = []
let scanA11y = 0
let scanViewport = 0

for (const tema of ['dark', 'light']) {
  // Gerakan dimatikan supaya elemen ber-animasi masuk sudah menetap saat
  // dipindai; situs memang mematikan seluruh animasinya pada mode ini.
  const konteks = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await konteks.addInitScript((t) => {
    try {
      localStorage.setItem('nuxt-color-mode', t)
    } catch {}
  }, tema)
  const page = await konteks.newPage()

  for (const rute of HALAMAN) {
    await page.goto(dasar + rute, { waitUntil: 'load' })
    await page.waitForTimeout(350)

    const hasil = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    scanA11y++
    for (const v of hasil.violations) {
      for (const n of v.nodes) {
        pelanggaran.push({
          rute,
          tema,
          id: v.id,
          dampak: v.impact,
          target: n.target.join(' '),
          html: n.html.replace(/\s+/g, ' ').slice(0, 110),
          sebab: (n.any[0]?.message ?? n.all[0]?.message ?? '').replace(/\s+/g, ' ').slice(0, 190),
        })
      }
    }

    // Sapuan viewport cukup sekali; tata letaknya sama di kedua tema.
    if (tema === 'dark') {
      for (const v of VIEWPORT) {
        await page.setViewportSize({ width: v.l, height: v.t })
        await page.waitForTimeout(120)
        scanViewport++
        const lebih = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        if (lebih > 1) {
          peluber.push({ rute, viewport: `${v.l}x${v.t}`, nama: v.nama, lebih, biang: await page.evaluate(CARI_PELUBER) })
        }
      }
      await page.setViewportSize({ width: 1440, height: 900 })
    }
  }
  await konteks.close()
}

await browser.close()
server.close()

const garis = '='.repeat(64)
console.log(`\n${garis}\nHASIL AUDIT LIGALESTARI\n${garis}`)
console.log(`Halaman diperiksa : ${HALAMAN.length}`)
console.log(`Pindai axe-core   : ${scanA11y} (${HALAMAN.length} halaman x 2 tema)`)
console.log(`Cek viewport      : ${scanViewport} (${HALAMAN.length} halaman x ${VIEWPORT.length} viewport)`)

console.log(`\n--- Aksesibilitas (WCAG 2.1 AA) ---`)
if (!pelanggaran.length) console.log('0 pelanggaran.')
else {
  for (const p of pelanggaran) {
    console.log(`\n  [${p.dampak}] ${p.id}  ${p.rute} (${p.tema})`)
    console.log(`     target : ${p.target}`)
    console.log(`     html   : ${p.html}`)
    console.log(`     sebab  : ${p.sebab}`)
  }
  console.log(`\n  Total: ${pelanggaran.length} node bermasalah.`)
}

console.log(`\n--- Gulir mendatar ---`)
if (!peluber.length) console.log(`${scanViewport}/${scanViewport} kombinasi lolos.`)
else {
  for (const o of peluber) {
    console.log(`  ${o.rute}  ${o.viewport} (${o.nama})  lebih ${o.lebih}px  biang: ${o.biang.join(', ')}`)
  }
  console.log(`  Total: ${peluber.length} kombinasi meluber.`)
}
console.log(garis)

process.exit(pelanggaran.length || peluber.length ? 1 : 0)

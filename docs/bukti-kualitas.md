# Bukti Kualitas LigaLestari: Data untuk Presentasi

Seluruh angka di bawah terukur pada build produksi (`npm run generate`), bukan klaim.

| Pemeriksaan | Terakhir diukur | Cara |
|---|---|---|
| Aksesibilitas (axe-core) | **18 Agustus 2026** | `npm run audit`, otomatis |
| Responsif (sapuan viewport) | **18 Agustus 2026** | `npm run audit`, otomatis |
| Lighthouse | 13 Juli 2026 | manual di Chrome Incognito |

Angka Lighthouse belum diukur ulang setelah penambahan halaman Aturan Liga, Jadwal & Hasil,
Mengapa Berbeda, dan Kalkulator Dampak, jadi tanggalnya sengaja dibedakan.

## 1. Lighthouse (emulasi seluler, CPU 4× lebih lambat, 13 Juli 2026)

| Halaman | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Beranda | **93** | **100** | **100** | **100** |
| Artikel | **94** | **100** | **100** | **100** |
| Metodologi | **94** | **100** | **100** | **100** |
| Peta Pohon | **82–84**¹ | **100** | **100** | **100** |
| Dasbor | **93** | **100** | **100** | 66² |

Metrik inti beranda: FCP 2,4 s · TBT 10 ms · CLS 0. Di produksi Vercel (desktop): **FCP 0,5 s · LCP 0,5 s · CLS 0**.

¹ Halaman peta memuat kanvas peta vektor interaktif (MapLibre GL), LCP-nya adalah peta itu
sendiri. Total Blocking Time tetap rendah (110–140 ms) karena peta dimuat malas saat mendekati
viewport.
² Disengaja: area pasca-login memakai `noindex`, praktik SEO yang benar untuk halaman privat.

> Catatan pengukuran: jalankan Lighthouse pada build produksi dan **jendela Incognito**
> (ekstensi browser ikut diaudit dan menurunkan skor, mis. sidebar AI menyuntikkan tombol
> tanpa nama aksesibel).

## 2. Aksesibilitas: axe-core (WCAG 2.1 AA)

**0 pelanggaran** pada **seluruh 25 halaman × 2 tema** (gelap & terang) = 50 pemindaian:
11 halaman publik, 5 halaman dasbor siswa, dan 9 halaman panel admin. Aturan yang diuji
mencakup `wcag2a`, `wcag2aa`, `wcag21a`, dan `wcag21aa`.

Audit ini kini **berupa skrip** ([`scripts/audit.mjs`](../scripts/audit.mjs), `npm run audit`)
yang berjalan atas build statis dengan Playwright, jadi bisa diulang kapan saja dan dipasang
di CI. Sapuan pertamanya pada 18 Agustus 2026 menemukan **37 node bermasalah** di 7 halaman
yang belum pernah masuk audit sebelumnya; seluruhnya sudah diperbaiki. Akar masalahnya satu:
warna merek dari data (kategori sampah, tag notifikasi, sumber poin tim) dipakai apa adanya
sebagai warna teks, padahal warna itu dirancang sebagai isian bar dan titik. Perbaikannya
memakai `teksMerek()` di [`app/utils/liga.ts`](../app/utils/liga.ts), yang menggeser tiap
warna ke gelap atau terang seminimal mungkin sampai lolos 4,5:1 di temanya masing-masing,
lalu memilihnya lewat CSS tanpa JavaScript saat runtime.

Fitur aksesibilitas yang diimplementasikan:

- **Dua tema** (gelap bawaan / terang), seluruh pasangan warna teks/latar lolos kontras
  AA ≥ 4,5:1 di kedua tema, diverifikasi skrip.
- **Ukuran huruf bisa diatur pengguna** (87,5–130%), berlaku seketika, tersimpan,
  tanpa kedip saat muat, seluruh teks memakai satuan rem.
- **Lencana warna kelas selalu terbaca**: `gayaEmblem()` memilih tinta putih/gelap
  berdasar luminansi WCAG dan menggeser warna bila perlu, aman untuk warna apa pun
  yang dipilih admin.
- **Skip-link** di semua layout; navigasi penuh keyboard termasuk pin peta (tombol asli),
  popup tertutup dengan Escape.
- **`prefers-reduced-motion` dihormati total**: semua animasi (scroll, transisi, peta) mati
  dan konten tidak pernah disembunyikan.
- HTML semantik, label ARIA pada semua kontrol ikon, `lang="id"`.

## 3. Responsif: semua perangkat

**175/175 kombinasi lolos tanpa overflow mendatar**: 7 viewport × 25 halaman
(publik + dasbor + admin), diukur otomatis oleh `npm run audit`. Termasuk halaman Mengapa
Berbeda yang memuat tabel perbandingan 7 kolom, elemen terlebar di seluruh situs; tabelnya
menggulir di dalam wadahnya sendiri sehingga halamannya tetap bebas gulir mendatar.

| Viewport | Mewakili |
|---|---|
| 320 × 568 | ponsel kecil |
| 375 × 812 | ponsel modern |
| 768 × 1024 | tablet portrait |
| 1024 × 768 | tablet landscape |
| 1440 × 900 | laptop |
| 1920 × 1080 | monitor Full-HD |
| 2560 × 1440 | monitor besar / 4K |

## 4. SEO teknis

- Skor Lighthouse SEO **100 di seluruh 7 tipe halaman publik**.
- JSON-LD schema.org di HTML statis: `WebSite`, `WebPage`, `Organization` (identitas
  penerbit + logo), `Article` + `Person` + `BreadcrumbList` di artikel.
- Sitemap.xml + robots.txt otomatis; canonical per halaman; area privat `noindex`.
- Open Graph & Twitter Card lengkap (gambar 1200×630 + alt + `og:locale id_ID`).

## 5. Fitur pembeda

- **Peta vektor sungguhan** (MapLibre GL + OpenFreeMap, tanpa API key): pin pohon kustom
  per kelas, pusat sekolah diatur admin (klik/seret/manual), fallback denah kanvas saat
  luring, gestur dua jari di ponsel.
- **PWA installable**: manifest + ikon maskable, bisa dipasang ke layar utama ponsel
  seperti aplikasi asli.
- **Ilustrasi SVG inline** per artikel (tanpa foto): tajam di semua ukuran, 0 request
  tambahan.
- **Fullstack + statis**: data via API Nitro + Neon (fallback demo lokal), namun tetap
  bisa digenerate statis penuh: 80 rute, 0 error.
- **Kalkulator dampak interaktif**: proyeksi satu musim dari asumsi yang diisi pengguna,
  memakai tarif kategori dan rate serapan yang sama persis dengan mesin liga.
- **Halaman Mengapa Berbeda**: matriks 9 platform pembanding x 6 kriteria, dan tiap klaim
  keunikan bertaut ke halaman yang membuktikannya.

## Cara mereproduksi

```bash
npm run generate   # build statis produksi
npm run audit      # axe-core 25 halaman x 2 tema + sapuan 7 viewport

# Lighthouse masih manual: sajikan build lalu ukur per halaman.
npx serve .output/public
# Chrome Incognito -> DevTools -> Lighthouse
```

`npm run audit` keluar dengan kode 1 bila ada temuan, jadi bisa langsung dipakai sebagai
gerbang di GitHub Actions.

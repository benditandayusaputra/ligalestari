# LigaLestari: Pilah Sampah, Rebut Juara

> Satu musim, satu aksi, satu bumi.

**LigaLestari** adalah aplikasi web **liga lingkungan kompetitif antar-kelas**: siswa
menjalankan misi hijau (memilah dan menyetor sampah, menanam pohon), setiap aksi
diverifikasi lewat bukti lalu dikonversi menjadi **Poin Hijau** dan **dampak CO₂
terukur**, dan kelas-kelas bersaing di klasemen ala liga olahraga sepanjang satu musim.

**Coba langsung: <https://ligalestari.vercel.app>** (Asisten Hijau aktif di situs ini;
salinan lokal menjawab dari basis pengetahuan bawaan sampai `AI_LLM_*` diisi).

Karya **Bendi Tandayu Saputra** untuk **Trunodjoyo Creative Competition 2026**, cabang
**Vibe Code** · Subtema: _Web Application Development_ · Tema: _Shaping Tomorrow: Digital
Innovation, Artificial Intelligence, and Sustainable Communities_.

## Teknologi

- **Framework**: [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript, SSG).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) dengan token tema di CSS.
- **Font**: Inter & Archivo via `@nuxt/fonts`, di-host sendiri saat build.
- **Ikon**: `@nuxt/icon` + koleksi Lucide & Simple Icons, dirender sebagai SVG inline.
- **SEO**: `@nuxtjs/seo` untuk sitemap, robots, canonical, dan schema.org otomatis.
- **Database**: [Neon](https://neon.tech) (Postgres serverless) lewat driver HTTP
  `@neondatabase/serverless`; skema, seed, dan migrasinya ada di `db/`.
- **Peta**: [MapLibre GL](https://maplibre.org) + tile **vektor** OpenFreeMap (gratis, tanpa
  API key). Pin pohon kustom per warna kelas, penanda sekolah, popup ringkasan, dan filter
  legenda. Pusat peta (lat/lng/zoom) diatur admin di **/admin/lokasi**: klik peta, seret
  penanda, atau isi manual; semua titik tanam digambar skematis di sekitar pusat itu (privasi).
  Contoh bawaan: **SMK Negeri 26 Jakarta** (Rawamangun, Jakarta Timur), koordinat OpenStreetMap.
  Bila peta gagal dimuat (luring), halaman otomatis jatuh ke denah kanvas lokal.
- **Animasi gulir**: directive `v-anim` buatan sendiri (±40 baris, IntersectionObserver,
  tanpa dependensi): fade-up halus + stagger di halaman publik, nonaktif total saat
  pengguna menyetel _prefers-reduced-motion_ (konten tidak pernah disembunyikan).

Aplikasi sudah **fullstack**: seluruh data disajikan lewat **API server Nitro** (`server/api/`)
dan halaman mengambilnya dengan `useFetch`. Untuk ketentuan lomba, situs tetap bisa digenerate
**statis penuh** (`nuxt generate`), data API dibekukan ke payload statis saat build, dan setiap
aksi tulis punya fallback lokal sehingga demo tetap berfungsi di Vercel/Netlify/GitHub Pages.

## Menjalankan

```bash
npm install        # pasang dependensi
npm run db:migrate # bangun skema + seed database Neon (butuh DATABASE_URL di .env)
npm run audit      # audit aksesibilitas & responsif atas build statis (butuh generate dulu)
npm run dev        # mode pengembangan (API server aktif) → http://localhost:3000
npm run generate   # build statis → .output/public (untuk pengumpulan lomba)
npm run build      # build server Node lengkap (API hidup) → node .output/server/index.mjs
npm run preview    # pratinjau hasil build
```

Saat deploy, atur env `NUXT_PUBLIC_SITE_URL` ke URL hosting agar canonical, sitemap, dan
robots.txt menunjuk domain yang benar, serta `DATABASE_URL` dan `NUXT_SESSION_PASSWORD`
agar database dan sesi login aktif, plus `GEMINI_API_KEY` agar Asisten Hijau menjawab lewat
LLM. Tanpa keempatnya situs tetap jalan memakai data demo dan jawaban asisten lokal.

## Struktur Proyek

```text
ligalestari/
├─ app/
│  ├─ assets/
│  │  ├─ css/main.css        # Tailwind + token design system (warna, font, utility)
│  │  └─ img/                # aset gambar teroptimasi
│  ├─ components/
│  │  ├─ AppNavbar.vue       # navigasi utama (desktop + menu seluler)
│  │  ├─ AppFooter.vue
│  │  ├─ ui/                 # komponen kecil lintas halaman (BadgePill, CountUp, …)
│  │  ├─ landing/            # section-section halaman Beranda
│  │  ├─ artikel/            # kartu artikel
│  │  ├─ peta/               # kanvas denah interaktif + legenda filter
│  │  ├─ auth/               # panel & form Masuk/Daftar/Gabung/Lupa
│  │  └─ dasbor/             # header, kartu stat, podium, balapan, kartu pencapaian
│  ├─ layouts/
│  │  ├─ default.vue         # kerangka publik: skip-link + navbar + footer
│  │  └─ dasbor.vue          # kerangka dasbor: sidebar desktop + tab bawah ponsel
│  ├─ pages/                 # rute situs; data diambil lewat useFetch('/api/…')
│  ├─ utils/                 # formatAngka, warna medali/tren, inisial
│  ├─ app.vue                # judul default & meta berbagi
│  └─ error.vue              # halaman 404/galat
├─ server/
│  ├─ api/                   # endpoint API Nitro (klasemen, artikel, dasbor, admin, auth, …)
│  └─ utils/                 # klien Neon (neon.ts), penjaga sesi, fallback memori (demo.ts)
├─ db/                       # schema.sql + seed.sql + migrate.mjs (npm run db:migrate)
├─ scripts/audit.mjs         # axe-core + sapuan viewport atas build statis (npm run audit)
├─ shared/
│  ├─ data/                  # data demo bertipe, sumber tunggal untuk server & fallback klien
│  └─ types/                 # tipe domain yang dipakai app + server
├─ public/                   # favicon, OG image, aset statis
└─ nuxt.config.ts
```

## API Server

Endpoint utama (`server/api/`); respons otomatis bertipe di sisi klien lewat `useFetch`:

- `GET /api/klasemen`: musim, klasemen 8 tim, total dampak, event aktif.
- `GET /api/artikel` · `GET /api/artikel/[slug]`: daftar & detail artikel (+terkait, 404 bila tak ada).
- `GET /api/peta`: titik tanam yang sudah digabung data kelasnya.
- `GET /api/metodologi`: tabel serapan CO₂ + sumber.
- `GET /api/dasbor`: profil siswa, rincian poin, anggota, riwayat, badge, notifikasi.
- `POST /api/asisten`: jawaban Asisten Hijau lewat Gemini, dengan basis pengetahuan lokal
  sebagai rujukan fakta sekaligus cadangan bila API tak tersedia.
- `POST /api/auth/masuk` · `POST /api/auth/gabung`: validasi akun demo & kode kelas.
- `GET|POST /api/admin/setoran` · `GET /api/admin/event` · `GET /api/admin/ringkasan` ·
  `GET /api/admin/laporan`: data panel admin; setoran baru tersimpan di memori server.
- `GET /api/admin/bukti` · `PATCH /api/admin/bukti/[id]`: verifikasi bukti tanam.
- `GET|POST /api/admin/kelas` · `GET /api/admin/kelas/[id]`: kelola kelas + kode gabung.

Saat dihosting statis, respons GET sudah terbekukan ke payload build dan setiap aksi tulis
jatuh ke fallback lokal dengan aturan yang sama (`shared/data`), sehingga perilaku demo identik.

## Database (Neon · Postgres)

Endpoint API membaca/menulis **Neon (Postgres serverless)** lewat driver HTTP
`@neondatabase/serverless`, sehingga tidak ada koneksi TCP yang perlu ditahan di
lingkungan serverless. Sumber datanya berlapis:

1. **Neon**: bila `DATABASE_URL` terisi dan tabelnya tersedia.
2. **Fallback demo** (`shared/data` + memori server), otomatis dipakai bila database
   belum dikonfigurasi/terjangkau, sehingga aplikasi selalu bisa berjalan (termasuk
   saat `nuxt generate` untuk pengumpulan lomba).

Lapis kedua bukan sekadar jaring pengaman: bentuk responsnya identik dengan lapis
pertama, jadi seluruh skenario tetap bisa diuji tanpa kredensial apa pun.

Penyiapan:

- Salin `.env.example` → `.env`, lalu isi `DATABASE_URL` dengan connection string dari
  dashboard Neon (pakai endpoint `-pooler`). URL ini **hanya** dibaca server;
  `runtimeConfig` menaruhnya di luar `public` sehingga tidak pernah sampai ke browser.
- Jalankan `npm run db:migrate` sekali. Skrip [`db/migrate.mjs`](db/migrate.mjs)
  menjalankan [`db/schema.sql`](db/schema.sql) → [`db/seed.sql`](db/seed.sql) → seed akun
  demo (sandi di-hash) di dalam satu transaksi; bila ada yang gagal, semuanya dibatalkan.
  Skrip ini **membangun ulang skema dari nol**, jadi isi tabel lama ikut terhapus.
- 16 tabel: `musim`, `tim`, `siswa`, `profil`, `artikel`, `jenis_pohon`, `titik_tanam`,
  `event_liga`, `setoran`, `bukti_tanam`, `notifikasi`, `badge`, `riwayat_tim`,
  `laporan_bulanan`, `laporan_spesies`, `pengaturan`.
- Saat deploy, isi `DATABASE_URL` di environment variables host (tersedia saat build,
  ikut terbaca runtime). Untuk menimpanya khusus saat jalan, pakai `NUXT_DATABASE_URL`.

## Autentikasi (sesi cookie + hash scrypt)

Login ditangani sendiri di tabel `profil` dengan sesi cookie terenkripsi
(`nuxt-auth-utils`), tanpa layanan auth pihak ketiga:

- Pengguna masuk dengan **username/NIS** (tanpa email). Satu kueri `join` mencocokkan
  keduanya, lalu sandi diverifikasi terhadap hash **scrypt** (`verifyPassword`); sandi
  teks polos tidak pernah tersimpan.
- **Pendaftaran sungguhan**: `POST /api/auth/daftar` membuat baris `siswa` + `profil` dan
  menaikkan `jumlah_siswa` kelasnya dalam **satu pernyataan CTE** (atomik, tidak mungkin
  ada akun setengah jadi), lalu langsung membuat sesi masuk.
- **Penjaga rute**: `/dasbor` butuh sesi, `/admin` butuh peran admin
  ([app/middleware/auth.global.ts](app/middleware/auth.global.ts)); endpoint tulis admin
  (setoran, verifikasi, buat kelas) menolak non-admin dengan 403.
- Penyiapan: `npm run db:migrate` sekaligus membuat akun demo `aditya.p/hijau123` (siswa)
  dan `admin/admin123` (admin); NIS `2231045` juga bisa dipakai masuk. Isi
  `NUXT_SESSION_PASSWORD` (min. 32 karakter) di `.env`: di produksi wajib diisi sebagai
  environment variable karena nilainya tidak ikut dibundel saat build.
- **Build statis lomba**: skrip `npm run generate` mematikan penjaga sesi
  (`NUXT_PUBLIC_AUTH_WAJIB=false`) karena hosting statis tidak punya server sesi;
  dasbor tetap bisa dijelajahi juri sebagai demo terbuka.

## Halaman

Publik:

- `/` (Landing): hero + podium, klasemen 5 besar, masalah, cara kerja, fitur, dampak,
  subtema, dan ajakan bergabung.
- `/artikel`: Daftar artikel edukasi + **filter kategori** (tersimpan di URL).
- `/artikel/[slug]`: Detail artikel + sumber + artikel terkait (schema.org `Article`).
- `/peta`: **Peta interaktif** persebaran pohon dengan pin per kelas, popup ringkasan,
  filter legenda, dan statistik dinamis.
- `/metodologi`: Transparansi rumus estimasi CO₂ + tabel acuan (berubah jadi kartu di layar
  kecil).
- `/kalkulator`: **Kalkulator dampak interaktif**, proyeksi satu musim dari asumsi sekolahmu
  memakai tarif dan rate serapan yang sama dengan mesin liga.
- `/aturan`: Buku aturan musim: cara main, tarif 6 kategori, formula poin, Duel Pekan, dan
  tiga jalur gelar.
- `/jadwal`: **Jadwal & Hasil** duel pekanan ala fixture liga + klasemen duel.
- `/mengapa-berbeda`: Matriks lanskap 9 platform pembanding x 6 kriteria + enam klaim
  keunikan yang tiap-tiapnya bertaut ke halaman pembuktinya.
- `/masuk`, `/daftar`: **Autentikasi mode demo** dengan login per peran, registrasi + kode kelas,
  gabung kelas, dan lupa password.

Dasbor siswa (view statis, `noindex`; data dari `app/data/`):

- `/dasbor`: klasemen dengan progres musim, banner event, dan tampilan **Podium** / **Balapan**.
- `/dasbor/tim`: profil tim berisi rincian poin, anggota, riwayat, + **kartu pencapaian** yang bisa
  dibagikan (WhatsApp/X/Telegram + salin caption).
- `/dasbor/saya`: kontribusi pribadi berupa level, statistik, dan koleksi badge.
- `/dasbor/notifikasi`: Daftar notifikasi liga.
- `/dasbor/asisten`: **Chatbot Asisten Hijau** bertenaga Gemini, dibumikan pada aturan liga
  dan jatuh ke basis pengetahuan lokal saat API mati (demo tak pernah kosong).

Panel admin (view statis, `noindex`):

- `/admin`: Ringkasan KPI harian + aksi cepat + pemuncak klasemen.
- `/admin/setoran`: **CRUD setoran (demo)** dengan alur form catat setoran → estimasi poin → masuk tabel.
- `/admin/event`: Musim berjalan + daftar event dan rate poinnya.
- `/admin/verifikasi`: **Moderasi bukti tanam**, setujui/tolak per kartu bukti.
- `/admin/laporan`: Grafik bulanan, sebaran spesies, ekspor **Cetak/PDF** & **CSV** (berfungsi).
- `/admin/kelas`, `/admin/kelas/[id]`, `/admin/kelas/baru`: kelola kelas dengan kode gabung + pratinjau
  QR, salin/buat ulang kode, daftar siswa, dan form kelas baru.

**Fitur interaktif** (ketentuan lomba: fitur utama wajib berfungsi sesuai konsep, semua
berjalan bahkan tanpa backend): autentikasi demo
dengan validasi & indikator kekuatan password · chatbot Asisten Hijau · peta pohon interaktif ·
pencatatan setoran + verifikasi bukti (CRUD demo) · kartu pencapaian yang dapat dibagikan ·
filter kategori artikel · ekspor laporan CSV/cetak · animasi angka klasemen.

## Tema Gelap/Terang & Liquid Glass

- **Dua tema** via `@nuxtjs/color-mode` (kelas `.dark` di `<html>`, gelap sebagai bawaan,
  pilihan tersimpan, tanpa kedipan saat muat). Toggle 🌙/☀️ ada di navbar publik,
  sidebar dasbor, dan bilah tab ponsel, bisa dioperasikan penuh lewat keyboard.
- **Design token dua mode** di [main.css](app/assets/css/main.css): permukaan
  (`bg/surface/surface-2/3/sorot`), teks 4 tingkat, garis, dan semburat hijau;
  seluruh pasangan teks/latar terverifikasi **WCAG AA di kedua mode** (skrip kontras).
- **Ukuran huruf bisa diatur pengguna** (aksesibilitas): tombol **Aa** di navbar, sidebar
  dasbor, dan panel "Tampilan" di ponsel, empat tingkat (87,5% / 100% / 115% / 130%),
  berlaku seketika tanpa muat ulang, tersimpan di perangkat, dan diterapkan sebelum cat
  pertama (tanpa kedipan). Seluruh teks memakai satuan rem sehingga skala konsisten.
- **Aksen liquid glass** (`glass`, `glass-hijau`, `glass-gelap`, `glass-tipis`) hanya di
  komponen sorotan: navbar, kartu podium hero, kartu fitur & dampak, kartu subtema,
  panel Asisten Hijau, dan overlay Kartu Pencapaian + motif garis daun samar.
  **Layar padat data tetap solid** (klasemen, setoran, verifikasi, laporan, form) demi
  keterbacaan angka.

## Kualitas yang dijaga (terukur, bukan klaim)

- **Lighthouse** (build statis, emulasi seluler): Beranda **93 / 100 / 100 / 100**,
  Artikel **94 / 100 / 100 / 100**, Peta **84 / 100 / 100 / 100** (halaman peta vektor
  interaktif; TBT 110 ms, CLS 0), Dasbor **93 / 100 / 100** (SEO sengaja `noindex`).
- **axe-core (WCAG 2.1 AA): 0 pelanggaran** pada 7 halaman kunci × 2 tema (gelap & terang).
  Lencana tim memakai `gayaEmblem()`: kontras AA dijamin untuk warna kelas apa pun
  yang dipilih admin (tinta putih/gelap dipilih otomatis, warna digeser bila perlu).
- **Responsif** dari ponsel kecil hingga monitor 4K: diuji **7 viewport (320 → 2560 px)
  × 10 halaman = 70 kombinasi, semuanya tanpa overflow mendatar**.
- **Aksesibilitas**: HTML semantik, skip-link di kedua layout, label ARIA pada kontrol ikon,
  peta & popup bisa dioperasikan keyboard, ukuran huruf bisa diatur pengguna, dan seluruh
  animasi hormat pada `prefers-reduced-motion`.
- **SEO**: judul & deskripsi per halaman, canonical, sitemap.xml, robots.txt, Open Graph +
  Twitter card, JSON-LD (WebSite, WebPage, Article).
- **Kecepatan**: prerender statis, font subset di-host sendiri, ikon SVG inline tanpa request
  tambahan, gambar dikompresi (emblem 502 KB → 24 KB), MapLibre dimuat malas saat peta
  mendekati viewport + `preconnect` ke server tile.

## Sumber & Kredit

- Data timbulan sampah nasional: **SIPSN, KLHK, 2023**.
- Angka serapan CO₂ per jenis pohon: **Endes N. Dahlan (2007), IPB** (nilai acuan; estimasi).
- Logo & emblem LigaLestari: karya sendiri (arsip prototype disimpan di luar repo).
- Font: [Inter](https://rsms.me/inter/) & [Archivo](https://fonts.google.com/specimen/Archivo)
  (lisensi SIL OFL, via Google Fonts).
- Ikon: [Lucide](https://lucide.dev) (ISC) & [Simple Icons](https://simpleicons.org) (CC0).

Seluruh data klasemen, artikel, dan titik tanam adalah **data contoh** untuk kebutuhan demo
babak penyisihan; otomatis digantikan data produksi begitu database Neon dikonfigurasi.

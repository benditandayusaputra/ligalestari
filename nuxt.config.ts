import tailwindcss from '@tailwindcss/vite'

// Build statis lomba (`npm run generate`) berjalan tanpa server sesi:
// penjaga rute dimatikan dan sebagian rute dibekukan saat build.
const buildStatis = process.env.NUXT_PUBLIC_AUTH_WAJIB === 'false'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxtjs/seo', 'nuxt-auth-utils', '@nuxtjs/color-mode'],

  // Tema gelap sebagai bawaan; pilihan pengguna tersimpan dan diterapkan
  // sebagai kelas pada <html> sebelum render (tanpa kedipan tema).
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  css: ['~/assets/css/main.css'],

  // Nama komponen mengikuti nama file (tanpa awalan folder),
  // mis. components/ui/BadgePill.vue → <BadgePill>.
  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [{ name: 'theme-color', content: '#0e6b46' }],
      script: [
        {
          // Terapkan ukuran huruf tersimpan sebelum cat pertama (anti-kedip).
          // Nilai divalidasi terhadap daftar pilihan di composables/ukuranTeks.ts.
          innerHTML:
            '(function(){try{var u=+localStorage.getItem("ligalestari-ukuran-teks");if([87.5,115,130].indexOf(u)>-1)document.documentElement.style.fontSize=u+"%"}catch(e){}})()',
          tagPosition: 'head',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // PWA: situs bisa di-install ke layar utama seperti aplikasi.
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  // Koneksi database Neon, HANYA di sisi server (tidak ada padanannya
  // di `public`, sehingga URL berisi kredensial tidak pernah sampai ke
  // browser). Nilai diisi dari .env (lihat .env.example).
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    // LLM Asisten Hijau (endpoint OpenAI-compatible); kosong = jawaban basis pengetahuan lokal.
    aiLlmBaseUrl: process.env.AI_LLM_BASE_URL ?? '',
    aiLlmApiKey: process.env.AI_LLM_API_KEY ?? '',
    aiLlmModel: process.env.AI_LLM_MODEL ?? '',
    public: {
      // Penjaga sesi /dasbor & /admin. Build statis lomba mematikannya
      // (tidak ada server sesi) lewat skrip `npm run generate`.
      authWajib: !buildStatis,
    },
  },

  // Identitas situs, dipakai modul SEO (sitemap, robots, schema.org, canonical).
  // Saat deploy cukup ganti lewat env NUXT_PUBLIC_SITE_URL tanpa mengubah kode.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://ligalestari.vercel.app',
    name: 'LigaLestari',
    description:
      'Liga kompetisi misi hijau antar-kelas: poin terverifikasi bukti, dampak CO2 terukur, dan klasemen yang membawa kelasmu ke puncak.',
    defaultLocale: 'id',
  },

  // OG image disediakan statis di /public agar hasil generate tetap ringan.
  ogImage: { enabled: false },

  routeRules: {
    '/api/peta': { cache: { maxAge: 60 } },
  },

  // Identitas penerbit untuk JSON-LD (Organization), memperkaya schema.org
  // yang dihasilkan otomatis di seluruh halaman.
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'LigaLestari',
      logo: '/favicon-192.png',
    },
  },

  // Area dasbor (pasca-masuk) tidak diindeks; halaman masuk/daftar adalah
  // pintu masuk publik sehingga tetap dapat dirayapi.
  sitemap: { exclude: ['/dasbor/**', '/dasbor', '/admin/**', '/admin'] },

  // Prerender HANYA untuk build statis: titik masuk area dasbor (halaman
  // lain ditemukan crawler dari tautan sidebar/tab) plus rute sesi agar
  // konsol tidak 404. Pada build server rute-rute ini wajib dinamis:
  // /api/_auth/session yang dibekukan akan disajikan CDN sebagai sesi
  // kosong, sehingga login tidak pernah dikenali penjaga rute.
  nitro: { prerender: { routes: buildStatis ? ['/dasbor', '/admin', '/api/_auth/session'] : [] } },

  // Font di-host sendiri saat build: cepat & tanpa request pihak ketiga.
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal'] },
      { name: 'Archivo', provider: 'google', weights: [500, 600, 700, 900], styles: ['normal'] },
    ],
  },

  // Ikon dirender sebagai <svg> inline saat prerender, tanpa request tambahan.
  icon: {
    mode: 'svg',
    serverBundle: { collections: ['lucide', 'simple-icons'] },
  },
})

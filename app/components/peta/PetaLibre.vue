<script setup lang="ts">
import type { Map as PetaGL, Marker } from 'maplibre-gl'
import type { LokasiSekolah, TitikPeta } from '#shared/types'
import 'maplibre-gl/dist/maplibre-gl.css'

/**
 * Peta sungguhan (MapLibre GL + tile vektor OpenFreeMap) untuk persebaran
 * pohon. Pin dibuat sebagai <button> agar bisa dioperasikan keyboard;
 * popup dirender Vue dan diposisikan lewat proyeksi peta. Bila gaya peta
 * gagal dimuat (offline), komponen memancarkan `gagal` supaya halaman
 * jatuh ke denah kanvas.
 */
const props = defineProps<{
  titik: TitikPeta[]
  pilihan: number | null
  lokasi: LokasiSekolah
}>()

const emit = defineEmits<{ pilih: [indeks: number]; tutup: []; gagal: [] }>()

const GAYA_PETA = 'https://tiles.openfreemap.org/styles/liberty'

const wadah = ref<HTMLDivElement>()
const dimuat = ref(false)
const posisiPopup = ref<{ x: number; y: number } | null>(null)

let peta: PetaGL | null = null
let lib: typeof import('maplibre-gl').default | null = null
let penanda: Marker[] = []
let penandaSekolah: Marker | null = null
const elemenPin = new Map<number, HTMLButtonElement>()
let sudahGagal = false

const titikAktif = computed(() => props.titik.find((t) => t.indeks === props.pilihan) ?? null)

const kurangiGerak = () =>
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function jatuhKeDenah() {
  if (sudahGagal) return
  sudahGagal = true
  peta?.remove()
  peta = null
  emit('gagal')
}

/** Pin pohon berbentuk tetes dengan ikon pohon, warna mengikuti kelas. */
function buatElemenPin(t: TitikPeta): HTMLButtonElement {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = 'pin-pohon'
  el.setAttribute('aria-label', `${t.kelas.nama}, ${t.jumlah} pohon ${t.jenisPohon}, ${t.tanggal}`)
  el.setAttribute('aria-pressed', String(t.indeks === props.pilihan))
  el.innerHTML =
    `<span class="pin-pohon-bentuk" style="background:${t.kelas.warna}">` +
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z"/><path d="M12 19v3"/>' +
    '</svg></span>'
  el.addEventListener('click', () => emit('pilih', t.indeks))
  return el
}

function pasangPenanda() {
  if (!peta || !lib) return
  penanda.forEach((m) => m.remove())
  penanda = []
  elemenPin.clear()
  for (const t of props.titik) {
    const el = buatElemenPin(t)
    const { lat, lng } = titikKeKoordinat(t.x, t.y, props.lokasi)
    penanda.push(new lib.Marker({ element: el, anchor: 'bottom' }).setLngLat([lng, lat]).addTo(peta))
    elemenPin.set(t.indeks, el)
  }
}

/** Penanda pusat sekolah, pembeda visual, tidak interaktif. */
function pasangPenandaSekolah() {
  if (!peta || !lib) return
  penandaSekolah?.remove()
  const el = document.createElement('div')
  el.className = 'pin-sekolah'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0e6b46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"/><path d="M18 5v17"/><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>'
  penandaSekolah = new lib.Marker({ element: el, anchor: 'center' })
    .setLngLat([props.lokasi.lng, props.lokasi.lat])
    .addTo(peta)
}

function perbaruiPopup() {
  const t = titikAktif.value
  if (!peta || !t) {
    posisiPopup.value = null
    return
  }
  const { lat, lng } = titikKeKoordinat(t.x, t.y, props.lokasi)
  const p = peta.project([lng, lat])
  posisiPopup.value = { x: p.x, y: p.y }
}

function keSekolah() {
  peta?.easeTo({
    center: [props.lokasi.lng, props.lokasi.lat],
    zoom: props.lokasi.zoom,
    duration: kurangiGerak() ? 0 : 600,
  })
}

// MapLibre menahan fokus saat pin diklik, jadi Escape didengarkan di window.
function tanganiEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.pilihan !== null) emit('tutup')
}

let pengintai: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('keydown', tanganiEscape)
  // Inisialisasi ditunda sampai peta mendekati viewport, memangkas kerja
  // thread utama saat halaman dibuka (TBT/LCP), terutama di ponsel yang
  // menampilkan kartu statistik lebih dulu.
  pengintai = new IntersectionObserver(
    (entri) => {
      if (entri.some((e) => e.isIntersecting)) {
        pengintai?.disconnect()
        pengintai = null
        nyalakanPeta()
      }
    },
    { rootMargin: '400px 0px' },
  )
  pengintai.observe(wadah.value!)
})

async function nyalakanPeta() {
  if (!navigator.onLine) return jatuhKeDenah()
  try {
    lib = (await import('maplibre-gl')).default
  } catch {
    return jatuhKeDenah()
  }

  peta = new lib.Map({
    container: wadah.value!,
    style: GAYA_PETA,
    center: [props.lokasi.lng, props.lokasi.lat],
    zoom: props.lokasi.zoom,
    minZoom: 3,
    maxZoom: 19.5,
    attributionControl: { compact: true },
    cooperativeGestures: true,
    fadeDuration: kurangiGerak() ? 0 : 300,
    locale: {
      'CooperativeGesturesHandler.WindowsHelpText': 'Tahan Ctrl sambil menggulir untuk memperbesar peta',
      'CooperativeGesturesHandler.MacHelpText': 'Tahan ⌘ sambil menggulir untuk memperbesar peta',
      'CooperativeGesturesHandler.MobileHelpText': 'Geser peta dengan dua jari',
      'NavigationControl.ZoomIn': 'Perbesar',
      'NavigationControl.ZoomOut': 'Perkecil',
    },
  })
  peta.addControl(new lib.NavigationControl({ showCompass: false }), 'top-right')

  // Beberapa ikon POI dirujuk gaya Liberty tapi tak ada di sprite-nya;
  // isi dengan piksel transparan agar konsol bersih dari peringatan.
  peta.on('styleimagemissing', (e) => {
    if (peta && !peta.hasImage(e.id)) peta.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) })
  })

  // Gagal memuat gaya/tile sebelum peta siap = fatal → jatuh ke denah kanvas.
  peta.on('error', () => {
    if (!dimuat.value) jatuhKeDenah()
  })
  const penjagaWaktu = setTimeout(() => {
    if (!dimuat.value) jatuhKeDenah()
  }, 15_000)

  peta.on('load', () => {
    clearTimeout(penjagaWaktu)
    dimuat.value = true
    pasangPenanda()
    pasangPenandaSekolah()
  })
  peta.on('move', perbaruiPopup)
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', tanganiEscape)
  pengintai?.disconnect()
  peta?.remove()
  peta = null
})

// Filter legenda mengubah daftar titik → pasang ulang pin.
watch(
  () => props.titik,
  () => {
    if (dimuat.value) {
      pasangPenanda()
      perbaruiPopup()
    }
  },
)

watch(
  () => props.pilihan,
  () => {
    for (const [indeks, el] of elemenPin) {
      el.classList.toggle('pin-aktif', indeks === props.pilihan)
      el.setAttribute('aria-pressed', String(indeks === props.pilihan))
    }
    const t = titikAktif.value
    if (t && peta) {
      const { lat, lng } = titikKeKoordinat(t.x, t.y, props.lokasi)
      peta.easeTo({ center: [lng, lat], offset: [0, 128], duration: kurangiGerak() ? 0 : 450 })
    }
    perbaruiPopup()
  },
)
</script>

<template>
  <div class="min-w-0 flex-1">
    <div class="relative">
      <div
        ref="wadah"
        class="peta-libre h-95 w-full overflow-hidden rounded-[18px] border border-[#C2D8BD] bg-[#DCEAD7] lg:h-130"
        role="application"
        aria-label="Peta area sekolah dengan titik penanaman pohon"
        @keydown.escape="emit('tutup')"
      />

      <!-- Kerangka pemuatan -->
      <div
        v-if="!dimuat"
        class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[18px] bg-[#DCEAD7]"
        aria-hidden="true"
      >
        <div class="flex items-center gap-2.5 rounded-full bg-white/80 px-4 py-2 text-small font-semibold text-[#0e6b46]">
          <Icon name="lucide:loader-circle" size="16" class="animate-spin motion-reduce:animate-none" />
          Memuat peta…
        </div>
      </div>

      <!-- Tombol kembali ke area sekolah -->
      <button
        v-if="dimuat"
        type="button"
        class="absolute bottom-3 left-3 z-20 flex items-center gap-1.75 rounded-full border border-[#C2D8BD] bg-white/92 px-3.25 py-1.75 text-caption font-bold text-[#0e6b46] shadow-[0_4px_14px_rgba(20,32,22,0.14)] hover:bg-white"
        @click="keSekolah"
      >
        <Icon name="lucide:school" size="13.5" aria-hidden="true" />
        Ke area sekolah
      </button>

      <!-- Popup ringkasan titik terpilih (mengikuti proyeksi peta) -->
      <div
        v-if="titikAktif && posisiPopup"
        role="dialog"
        :aria-label="`Detail penanaman ${titikAktif.kelas.nama}`"
        class="anim-pop absolute z-30 w-60 rounded-[14px] border border-[#E4E1D7] bg-white p-3.5 text-[#16201A] shadow-[0_16px_40px_rgba(20,32,22,0.22)]"
        :style="{
          left: `${posisiPopup.x}px`,
          top: `${posisiPopup.y}px`,
          transform: 'translate(-50%, calc(-100% - 48px))',
        }"
      >
        <button
          type="button"
          class="absolute top-5.5 right-5.5 z-10 flex h-6 w-6 items-center justify-center rounded-[7px] bg-white/90 hover:bg-white"
          aria-label="Tutup detail"
          @click="emit('tutup')"
        >
          <Icon name="lucide:x" size="13" class="text-[#5F6961]" aria-hidden="true" />
        </button>
        <!-- Foto dokumentasi yang diunggah kelas saat menanam -->
        <img
          v-if="titikAktif.foto"
          :src="titikAktif.foto"
          :alt="`Foto dokumentasi penanaman ${titikAktif.jenisPohon} oleh ${titikAktif.kelas.nama}`"
          class="mb-3 aspect-2/1 w-full rounded-[10px] border border-[#E4E1D7] object-cover"
          width="400"
          height="250"
          loading="lazy"
        />
        <div class="mb-3 flex items-center gap-2.25">
          <span class="h-3.25 w-3.25 shrink-0 rounded-full" :style="{ background: titikAktif.kelas.warna }" aria-hidden="true" />
          <span class="font-display text-body font-bold">{{ titikAktif.kelas.nama }}</span>
        </div>
        <div class="flex gap-2.5">
          <div class="flex-1 rounded-[10px] bg-[#F4F2EA] px-2.75 py-2.25">
            <div class="font-display text-[1.1875rem] font-bold text-[#0e6b46]">{{ titikAktif.jumlah }}</div>
            <div class="text-caption font-semibold text-[#5F6961]">pohon {{ titikAktif.jenisPohon }}</div>
          </div>
          <div class="flex-1 rounded-[10px] bg-[#F4F2EA] px-2.75 py-2.25">
            <div class="font-display text-[1.1875rem] font-bold text-[#0e6b46]">{{ formatAngka(titikAktif.co2) }}</div>
            <div class="text-caption font-semibold text-[#5F6961]">kg CO₂/th</div>
          </div>
        </div>
        <div class="mt-2.75 flex items-center justify-between gap-2 text-[#636D65]">
          <span class="flex items-center gap-1.75">
            <Icon name="lucide:calendar-days" size="14" aria-hidden="true" />
            <span class="text-caption font-semibold">{{ titikAktif.tanggal }}</span>
          </span>
          <span v-if="titikAktif.foto" class="text-caption text-[#8A948B]">Dokumentasi kelas</span>
        </div>
        <div
          class="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-[#E4E1D7] bg-white"
          aria-hidden="true"
        />
      </div>
    </div>

    <p class="mx-0.5 mt-2.5 text-caption text-teks-samar">
      Peta oleh OpenStreetMap · posisi titik bersifat skematis di sekitar area sekolah demi privasi.
      Klik pin pohon untuk melihat ringkasan per kelas.
    </p>
  </div>
</template>

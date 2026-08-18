<script setup lang="ts">
import type { Map as PetaGL, Marker } from 'maplibre-gl'
import type { LokasiSekolah } from '#shared/types'
import 'maplibre-gl/dist/maplibre-gl.css'

/**
 * Mini-peta pemilih lokasi sekolah untuk panel admin: klik peta atau seret
 * penanda untuk menggeser pusat; zoom peta ikut tersimpan. Dua arah dengan
 * kolom isian lewat v-model. Bila peta gagal dimuat (offline), memancarkan
 * `gagal`: kolom isian manual tetap berfungsi.
 */
const lokasi = defineModel<LokasiSekolah>({ required: true })
const emit = defineEmits<{ gagal: [] }>()

const wadah = ref<HTMLDivElement>()
const dimuat = ref(false)
let peta: PetaGL | null = null
let penanda: Marker | null = null
let dariPeta = false

onMounted(async () => {
  if (!navigator.onLine) return emit('gagal')
  let lib: typeof import('maplibre-gl').default
  try {
    lib = (await import('maplibre-gl')).default
  } catch {
    return emit('gagal')
  }

  peta = new lib.Map({
    container: wadah.value!,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [lokasi.value.lng, lokasi.value.lat],
    zoom: lokasi.value.zoom,
    minZoom: 3,
    maxZoom: 19.5,
    attributionControl: { compact: true },
  })
  peta.addControl(new lib.NavigationControl({ showCompass: false }), 'top-right')
  peta.on('styleimagemissing', (e) => {
    if (peta && !peta.hasImage(e.id)) peta.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) })
  })

  const el = document.createElement('div')
  el.className = 'pin-sekolah'
  el.innerHTML =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0e6b46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"/><path d="M18 5v17"/><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>'
  penanda = new lib.Marker({ element: el, anchor: 'center', draggable: true })
    .setLngLat([lokasi.value.lng, lokasi.value.lat])
    .addTo(peta)

  const tulis = (lat: number, lng: number) => {
    dariPeta = true
    lokasi.value = {
      lat: Math.round(lat * 1e6) / 1e6,
      lng: Math.round(lng * 1e6) / 1e6,
      zoom: Math.round(peta!.getZoom() * 10) / 10,
    }
  }
  penanda.on('dragend', () => {
    const p = penanda!.getLngLat()
    tulis(p.lat, p.lng)
  })
  peta.on('click', (e) => {
    penanda!.setLngLat(e.lngLat)
    tulis(e.lngLat.lat, e.lngLat.lng)
  })
  peta.on('zoomend', () => {
    const p = penanda!.getLngLat()
    tulis(p.lat, p.lng)
  })

  peta.on('error', () => {
    if (!dimuat.value) {
      peta?.remove()
      peta = null
      emit('gagal')
    }
  })
  peta.on('load', () => {
    dimuat.value = true
  })
})

onBeforeUnmount(() => {
  peta?.remove()
  peta = null
})

// Isian manual berubah → geser penanda & pusat peta (abaikan gema dari peta).
watch(
  lokasi,
  (v) => {
    if (dariPeta) {
      dariPeta = false
      return
    }
    if (!peta || !penanda || !Number.isFinite(v.lat) || !Number.isFinite(v.lng)) return
    penanda.setLngLat([v.lng, v.lat])
    peta.jumpTo({ center: [v.lng, v.lat], zoom: v.zoom })
  },
  { deep: true },
)
</script>

<template>
  <div class="relative">
    <div
      ref="wadah"
      class="peta-pilih h-72 w-full overflow-hidden rounded-[14px] border border-garis bg-[#DCEAD7] lg:h-85"
      role="application"
      aria-label="Peta pemilih lokasi sekolah, klik atau seret penanda untuk memindah pusat"
    />
    <div
      v-if="!dimuat"
      class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[14px] bg-[#DCEAD7]"
      aria-hidden="true"
    >
      <div class="flex items-center gap-2.5 rounded-full bg-white/80 px-4 py-2 text-[0.78125rem] font-semibold text-[#0e6b46]">
        <Icon name="lucide:loader-circle" size="16" class="animate-spin motion-reduce:animate-none" />
        Memuat peta…
      </div>
    </div>
  </div>
</template>

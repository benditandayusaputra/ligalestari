<script setup lang="ts">
import type { TimKelas } from '#shared/types'
import { MUSIM } from '#shared/data/klasemen'

/**
 * Dialog kartu pencapaian yang siap dibagikan. Tombol berbagi memakai
 * tautan intent resmi tiap platform sehingga berfungsi tanpa backend.
 */
const props = defineProps<{ tim: TimKelas }>()
const buka = defineModel<boolean>('buka', { default: false })

const tombolTutup = ref<HTMLButtonElement>()
watch(buka, (v) => {
  if (v) nextTick(() => tombolTutup.value?.focus())
})

const caption = computed(
  () =>
    `Tim ${props.tim.julukan} ${props.tim.nama} naik ke peringkat #1 di LigaLestari! ` +
    `${props.tim.kg} kg sampah terpilah, ${props.tim.pohon} pohon ditanam, ` +
    `${formatAngka(props.tim.co2)} kg CO₂ diserap. Pilah sampah, rebut juara. ` +
    '#LigaLestari #PilahSampahRebutJuara #Adiwiyata',
)

const BAGIKAN = computed(() => [
  { label: 'WhatsApp', ikon: 'simple-icons:whatsapp', bg: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(caption.value)}` },
  { label: 'X', ikon: 'simple-icons:x', bg: '#16201A', url: `https://x.com/intent/post?text=${encodeURIComponent(caption.value)}` },
  { label: 'Telegram', ikon: 'simple-icons:telegram', bg: '#229ED9', url: `https://t.me/share/url?url=ligalestari&text=${encodeURIComponent(caption.value)}` },
])

const tersalin = ref(false)
async function salinCaption() {
  await navigator.clipboard.writeText(caption.value)
  tersalin.value = true
  setTimeout(() => (tersalin.value = false), 2000)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="buka"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(10,18,12,0.78)] p-4"
      @click.self="buka = false"
      @keydown.escape="buka = false"
    >
      <div role="dialog" aria-modal="true" aria-label="Kartu pencapaian tim" class="w-full max-w-sm py-4">
        <div class="mb-2.5 flex items-center justify-between">
          <p class="text-[0.6875rem] font-bold tracking-[0.08em] text-white/70 uppercase">Kartu Pencapaian</p>
          <button
            ref="tombolTutup"
            type="button"
            class="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            aria-label="Tutup kartu pencapaian"
            @click="buka = false"
          >
            <Icon name="lucide:x" size="17" class="text-white" aria-hidden="true" />
          </button>
        </div>

        <!-- Kartu yang dibagikan -->
        <div class="anim-pop garis-lapangan relative overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(165deg,#095536_0%,#0e6b46_55%,#095536_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div class="relative z-2 p-5.5">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex items-center gap-1.75">
                <span class="flex h-6 w-6 items-center justify-center rounded-[7px] bg-white">
                  <LestariEmblem class="h-5 w-5 text-hijau" />
                </span>
                <span class="font-display text-sm font-bold text-white">LigaLestari</span>
              </div>
              <span class="text-[0.625rem] font-semibold text-white/65">{{ MUSIM.nama }}</span>
            </div>

            <div class="mb-4.5 text-center">
              <div class="mb-4 inline-flex items-center gap-1.75 rounded-full bg-lime px-3.5 py-1.5">
                <Icon name="lucide:arrow-up" size="14" class="text-tinta" aria-hidden="true" />
                <span class="text-[0.6875rem] font-bold tracking-[0.04em] text-tinta">NAIK KE PERINGKAT #1</span>
              </div>
              <TimEmblem :warna="tim.warna" :teks="tim.emblem" :ukuran="84" class="mx-auto mb-3 border-[3px] border-white/50 shadow-[0_10px_24px_rgba(0,0,0,0.3)]" />
              <div class="font-display text-[1.375rem] font-bold text-white">{{ tim.nama }}</div>
              <div class="text-[0.8125rem] font-medium text-white/75">Tim {{ tim.julukan }}</div>
            </div>

            <div class="mb-3 rounded-2xl bg-black/20 py-3.5 text-center">
              <div class="text-[0.6875rem] font-semibold tracking-[0.06em] text-lime">POIN HIJAU</div>
              <div class="font-display text-[2.875rem] leading-none font-bold text-white">{{ formatAngka(tim.poin) }}</div>
            </div>

            <div class="mb-4.5 flex gap-2.25">
              <div class="flex-1 rounded-[13px] bg-white/10 px-2 py-3 text-center">
                <div class="font-display text-lg font-bold text-white">{{ tim.kg }}</div>
                <div class="text-[0.59375rem] font-semibold text-white/70">KG SAMPAH</div>
              </div>
              <div class="flex-1 rounded-[13px] bg-white/10 px-2 py-3 text-center">
                <div class="font-display text-lg font-bold text-white">{{ tim.pohon }}</div>
                <div class="text-[0.59375rem] font-semibold text-white/70">POHON</div>
              </div>
              <div class="flex-1 rounded-[13px] bg-white/10 px-2 py-3 text-center">
                <div class="font-display text-lg font-bold text-white">{{ formatAngka(tim.co2) }}</div>
                <div class="text-[0.59375rem] font-semibold text-white/70">KG CO₂</div>
              </div>
            </div>

            <div class="border-t border-white/15 pt-3.5 text-center">
              <div class="font-display text-[0.9375rem] font-bold text-lime">Pilah sampah, rebut juara.</div>
              <div class="mt-0.75 text-[0.625rem] text-white/55">SMK Negeri 4 · #LigaLestari · @tcc.triplec</div>
            </div>
          </div>
        </div>

        <!-- Tombol berbagi -->
        <div class="my-4 flex gap-2.25">
          <a
            v-for="b in BAGIKAN"
            :key="b.label"
            :href="b.url"
            target="_blank"
            rel="noopener"
            class="flex flex-1 flex-col items-center gap-1.25 rounded-[14px] bg-white/10 py-3 hover:bg-white/20"
          >
            <span class="flex h-8.5 w-8.5 items-center justify-center rounded-full" :style="{ background: b.bg }">
              <Icon :name="b.ikon" size="16" class="text-white" aria-hidden="true" />
            </span>
            <span class="text-[0.625rem] font-semibold text-white">{{ b.label }}</span>
          </a>
        </div>

        <button
          type="button"
          class="flex w-full items-center justify-center gap-2.25 rounded-[14px] bg-lime p-3.5 text-sm font-bold text-tinta hover:bg-daun"
          @click="salinCaption"
        >
          <Icon :name="tersalin ? 'lucide:check' : 'lucide:copy'" size="17" aria-hidden="true" />
          {{ tersalin ? 'Caption tersalin!' : 'Salin caption + hashtag' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

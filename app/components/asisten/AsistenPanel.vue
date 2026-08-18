<script setup lang="ts">
import { SARAN_CHAT } from '#shared/data/asisten'

/**
 * Panel percakapan Asisten Hijau: bottom sheet di ponsel,
 * kartu melayang di kanan bawah pada layar lebar.
 */
const props = defineProps<{ buka: boolean }>()
const emit = defineEmits<{ tutup: [] }>()

const { pesan, ketikan, sedangMengetik, kirim } = useAsistenHijau()

const areaPesan = ref<HTMLElement>()
const inputTanya = ref<HTMLInputElement>()

watch([() => pesan.value.length, sedangMengetik], async () => {
  await nextTick()
  areaPesan.value?.scrollTo({ top: areaPesan.value.scrollHeight, behavior: 'smooth' })
})

// Saat panel dibuka, fokus langsung ke kolom pertanyaan.
watch(
  () => props.buka,
  async (terbuka) => {
    if (terbuka) {
      await nextTick()
      inputTanya.value?.focus()
    }
  },
)
</script>

<template>
  <section
    role="dialog"
    aria-label="Asisten Hijau"
    class="fixed right-0 bottom-0 z-50 flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-garis bg-surface shadow-[0_18px_50px_rgba(10,18,12,0.22)] sm:right-6 sm:bottom-6 sm:h-130 sm:w-90 sm:rounded-2xl"
    @keydown.escape="emit('tutup')"
  >
    <!-- Kepala panel -->
    <header class="flex items-center gap-2.5 bg-hijau-pekat px-4 py-3">
      <Icon name="lucide:leaf" size="19" class="shrink-0 text-lime" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="font-display text-small font-semibold text-white">Asisten Hijau</p>
        <p class="text-caption font-medium text-lime">Edukasi sampah &amp; pohon</p>
      </div>
      <button
        type="button"
        aria-label="Tutup Asisten Hijau"
        class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/15"
        @click="emit('tutup')"
      >
        <Icon name="lucide:x" size="18" class="text-white" aria-hidden="true" />
      </button>
    </header>

    <!-- Riwayat percakapan -->
    <div ref="areaPesan" class="flex-1 space-y-3 overflow-y-auto p-3.5" aria-live="polite">
      <GelembungChat v-for="(m, i) in pesan" :key="i" :pesan="m" />
      <IndikatorMengetik v-if="sedangMengetik" />
    </div>

    <!-- Pertanyaan cepat + kolom input -->
    <div class="border-t border-garis bg-surface px-3 pt-2.5 pb-[max(env(safe-area-inset-bottom),10px)] sm:pb-2.5">
      <div class="mb-2.25 flex flex-wrap gap-1.5" role="group" aria-label="Saran pertanyaan">
        <button
          v-for="s in SARAN_CHAT"
          :key="s"
          type="button"
          class="rounded-full border border-mint-garis bg-hijau-pucat px-2.75 py-1.5 text-caption font-semibold text-hijau-teks hover:bg-mint"
          @click="kirim(s)"
        >
          {{ s }}
        </button>
      </div>
      <form class="flex items-center gap-2 rounded-2xl border border-garis bg-surface-2 py-1.5 pr-1.5 pl-3.5" @submit.prevent="kirim()">
        <label for="asisten-tanya" class="sr-only">Tulis pertanyaan</label>
        <input
          id="asisten-tanya"
          ref="inputTanya"
          v-model="ketikan"
          type="text"
          placeholder="Tanya soal sampah & pohon…"
          class="min-w-0 flex-1 bg-transparent text-small outline-none focus-visible:outline-none"
        />
        <button
          type="submit"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hijau transition-colors hover:bg-hijau-pekat"
          aria-label="Kirim pertanyaan"
        >
          <Icon name="lucide:send" size="18" class="text-lime" aria-hidden="true" />
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SARAN_CHAT } from '#shared/data/asisten'

definePageMeta({ layout: 'dasbor' })
useSeoMeta({ title: 'Asisten Hijau' })

const { pesan, ketikan, sedangMengetik, kirim } = useAsistenHijau()

const ujungChat = ref<HTMLElement>()
watch([() => pesan.value.length, sedangMengetik], async () => {
  await nextTick()
  ujungChat.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
})
</script>

<template>
  <div class="flex min-h-[calc(100dvh-7rem)] flex-col lg:min-h-0">
    <DasborHeader variant="polos" judul="Asisten Hijau" sub="Online · edukasi hijau" />

    <div class="flex-1 space-y-3 px-4 pt-4 pb-3 lg:px-0" aria-live="polite">
      <GelembungChat v-for="(m, i) in pesan" :key="i" :pesan="m" />
      <IndikatorMengetik v-if="sedangMengetik" />
      <div ref="ujungChat" />
    </div>

    <div class="sticky bottom-24 z-10 bg-krem px-4 pt-1 pb-2 lg:bottom-4 lg:px-0">
      <div class="mb-2.25 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Saran pertanyaan">
        <button
          v-for="s in SARAN_CHAT"
          :key="s"
          type="button"
          class="rounded-full border border-mint-garis bg-surface px-3 py-1.75 text-[0.71875rem] font-semibold whitespace-nowrap text-hijau-teks hover:bg-mint"
          @click="kirim(s)"
        >
          {{ s }}
        </button>
      </div>
      <form class="flex items-center gap-2.25 rounded-2xl border border-garis bg-surface py-1.5 pr-1.5 pl-3.5" @submit.prevent="kirim()">
        <label for="chat-input" class="sr-only">Tulis pertanyaan</label>
        <input
          id="chat-input"
          v-model="ketikan"
          type="text"
          placeholder="Tanya soal sampah & penghijauan…"
          class="flex-1 bg-transparent text-[0.8125rem] outline-none focus-visible:outline-none"
        />
        <button
          type="submit"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hijau hover:bg-hijau-pekat"
          aria-label="Kirim pertanyaan"
        >
          <Icon name="lucide:send" size="18" class="text-lime" aria-hidden="true" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PesanChat } from '#shared/types'

/** Satu gelembung percakapan: bot rata kiri, siswa rata kanan. */
defineProps<{ pesan: PesanChat }>()
</script>

<template>
  <div v-if="pesan.dari === 'bot'" class="flex max-w-[84%] items-end gap-2.25">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-hijau" aria-hidden="true">
      <Icon name="lucide:leaf" size="14" class="text-lime" />
    </span>
    <p class="rounded-2xl rounded-bl-[4px] border border-garis bg-surface px-3.25 py-2.75 text-[0.8125rem] leading-[1.45]">
      {{ pesan.teks }}
    </p>
  </div>
  <p
    v-else
    class="ml-auto w-fit max-w-[82%] rounded-2xl rounded-br-[4px] bg-hijau px-3.25 py-2.75 text-[0.8125rem] leading-[1.45] text-white"
  >
    {{ pesan.teks }}
  </p>
</template>

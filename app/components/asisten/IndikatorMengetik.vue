<template>
  <!-- Tiga titik berdenyut: bot sedang menyiapkan jawaban -->
  <div class="flex items-end gap-2.25">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-hijau" aria-hidden="true">
      <Icon name="lucide:leaf" size="14" class="text-lime" />
    </span>
    <span class="flex gap-1 rounded-2xl border border-garis bg-surface px-3.75 py-3.25" aria-label="Asisten sedang mengetik">
      <span
        v-for="j in 3"
        :key="j"
        class="h-1.5 w-1.5 animate-pulse rounded-full bg-teks-samar"
        :style="{ animationDelay: `${j * 0.2}s` }"
      />
    </span>
  </div>
</template>

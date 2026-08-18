<script setup lang="ts">
defineEmits<{ klik: [] }>()
</script>

<template>
  <button
    type="button"
    aria-label="Buka Asisten Hijau"
    class="group flex h-14 w-14 items-center justify-center rounded-full bg-hijau shadow-[0_10px_30px_rgba(9,85,54,0.35)] transition hover:scale-105 hover:bg-hijau-pekat motion-reduce:transition-none motion-reduce:hover:scale-100"
    @click="$emit('klik')"
  >
    <Icon name="lucide:leaf" size="26" class="text-lime transition group-hover:-rotate-12 motion-reduce:transition-none" aria-hidden="true" />
    <!-- Lencana status online -->
    <span class="absolute top-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-lime" aria-hidden="true" />
    <span class="sr-only">(online)</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  placeholder?: string
  autocomplete?: string
  /** Keterangan kecil di bawah isian. */
  keterangan?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <label :for="id" class="mb-1.75 block text-[0.6875rem] font-bold tracking-[0.04em] text-teks-redup uppercase">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="w-full rounded-xl border border-garis bg-surface-2 px-3.5 py-3.25 text-[0.9375rem] text-teks-kuat transition outline-none focus:border-hijau focus:bg-surface focus:shadow-[0_0_0_3px_rgba(14,107,70,0.14)] focus-visible:outline-none"
    />
    <p v-if="keterangan" class="mt-1 text-[0.6875rem] text-teks-samar">{{ keterangan }}</p>
  </div>
</template>

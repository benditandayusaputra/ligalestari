<script setup lang="ts">
defineProps<{
  id: string
  label: string
  placeholder?: string
  autocomplete?: string
}>()

const model = defineModel<string>({ default: '' })
const lihat = ref(false)
</script>

<template>
  <div>
    <label :for="id" class="mb-1.75 block text-[0.6875rem] font-bold tracking-[0.04em] text-teks-redup uppercase">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="lihat ? 'text' : 'password'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="w-full rounded-xl border border-garis bg-surface-2 py-3.25 pr-11.5 pl-3.5 text-[0.9375rem] text-teks-kuat transition outline-none focus:border-hijau focus:bg-surface focus:shadow-[0_0_0_3px_rgba(14,107,70,0.14)] focus-visible:outline-none"
      />
      <button
        type="button"
        class="absolute top-1/2 right-1.75 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[9px] hover:bg-[#EEF2EA]"
        :aria-label="lihat ? 'Sembunyikan password' : 'Tampilkan password'"
        @click="lihat = !lihat"
      >
        <Icon :name="lihat ? 'lucide:eye-off' : 'lucide:eye'" size="19" class="text-teks-redup" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

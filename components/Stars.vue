<script lang="ts" setup>
const {value, clickable} = defineProps<{
  value: number,
  clickable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', id: number): void
}>()
</script>

<template>
  <button v-for="i in 5"
          v-if="clickable"
          class="hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
          @click.prevent="value = value === i ? 0 : i; emit('update:value', value)">
    <span
        :class="{'material-icons': value >= i, 'material-icons-outlined': value < i}"
        class="text-button dark:text-buttondark cursor-default"
    >star_rate</span>
  </button>
  <span v-for="i in 5"
        v-else
        :class="{'material-icons': value >= i, 'material-icons-outlined': value < i}"
        class="text-button dark:text-buttondark cursor-default"
  >star_rate</span>
</template>

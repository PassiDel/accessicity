<script lang="ts" setup>
const {value} = defineProps<{
  value: number,
}>()
</script>

<template>
  <span v-for="i in value" class="material-icons text-button dark:text-buttondark">star_rate</span>
  <span v-for="i in (5 - value)" class="material-icons-outlined text-button dark:text-buttondark">star_rate</span>
</template>

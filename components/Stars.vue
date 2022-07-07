<script lang="ts" setup>
const {value} = defineProps<{
  value: number,
}>()
</script>

<template>
  <span v-for="i in value" class="material-icons text-primary">star_rate</span>
  <span v-for="i in (5 - value)" class="material-icons-outlined text-primary">star_rate</span>
</template>

<style scoped>
@import 'material-icons/iconfont/filled.css';
@import 'material-icons/iconfont/outlined.css';
</style>

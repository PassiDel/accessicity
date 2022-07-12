<script lang="ts" setup>
const {name, slug, id, icon, trans_name, description, verified} = defineProps<{
  name: String,
  slug?: String,
  id?: String,
  icon: String,
  trans_name?: String,
  description?: String,
  verified?: Boolean,
}>()

</script>

<template>
<span
    :class="{
      'bg-green-400': verified,
      'dark:bg-green-600': verified,

      'border-green-600': verified,
      'dark:border-green-800': verified,

      'bg-yellow-400': !verified,
      'dark:bg-yellow-600': !verified,

      'border-yellow-600': !verified,
      'dark:border-yellow-700': !verified,
    }"
    :title="trans_name ? $t(`${trans_name}.name`) : (description || name)"
    class="material-icons p-1 rounded-full border-2
  text-black dark:text-black
  bg-white dark:bg-white">{{ icon }}</span>
</template>

<style scoped>
@import 'material-icons/iconfont/filled.css';
</style>

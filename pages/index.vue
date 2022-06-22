<script setup lang="ts">
const colorMode = useColorMode()

const count = ref(0)
</script>

<template>

  <div>
    <button
        class="border rounded px-5 py-2 m-5
        bg-red-700
        hover:bg-yellow-600
        text-rose-200
        transition duration-300 ease-out"
        @click.prevent="count++"
    >{{ count }}</button>
    <h1 class="text-slate-900 dark:text-white">Color mode: {{ $colorMode.preference }}</h1>

  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
const colorMode = useColorMode()

useHead({
  bodyAttrs: {
    class: 'bg-jelly-bean-50 dark:bg-jelly-bean-900 transition duration-500'
  }
})

</script>

<template>
  <select v-model="colorMode.preference"
          class="p-1 rounded border
            bg-mexican-red-50
              hover:bg-mexican-red-200
            dark:bg-mexican-red-800 dark:text-white dark:border-zinc-700
              dark:hover:bg-mexican-red-600
            transition duration-300 ease-out">
    <option value="system">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="sepia">Sepia</option>
  </select>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>

</template>

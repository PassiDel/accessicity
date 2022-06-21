<script setup lang="ts">
const colorMode = useColorMode()

useHead({
  bodyAttrs: {
    class: 'bg-jelly-bean-50 dark:bg-jelly-bean-900 transition duration-500'
  }
})


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

  </div>
</template>

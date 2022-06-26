<script setup lang="ts">
import {useCounterStore} from "~/store/counter";

const colorMode = useColorMode()

const counter = useCounterStore()
</script>

<template>

  <div>
    <button
        class="border rounded px-5 py-2 m-5
        bg-red-700
        hover:bg-yellow-600
        text-rose-200
        transition duration-300 ease-out"
        @click.prevent="counter.increment()"
    >{{ counter.count }}</button>
    <h1 class="text-slate-900 dark:text-white">{{ $t('darkmode.mode', {mode: $t(`darkmode.${$colorMode.preference}`)}) }}</h1>

  </div>
</template>

<style scoped>

</style>

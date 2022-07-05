<script setup lang="ts">
import {useCounterStore} from "~/store/counter";
import {definePageMeta, useColorMode} from "#imports";
import {useFetchWithHeader} from "~/composable/fetch";

const colorMode = useColorMode()

const counter = useCounterStore()

definePageMeta({
  title: 'Index'
})

const {pending, data: result, refresh} = await useFetchWithHeader('/api/user')
console.log(pending)
</script>

<template>

  <div>
    <h3 v-if="pending" class="dark:text-white">Loading...</h3>
    <div v-else>
      <h3 class="dark:text-white">{{ result?.user.createdAt }}</h3>
      <button class="dark:bg-white p-3 rounded" @click.prevent="refresh()">refresh</button>
    </div>
    <button
        class="border rounded px-5 py-2 m-5
        bg-red-700
        hover:bg-yellow-600
        text-rose-200
        transition duration-300 ease-out"
        @click.prevent="counter.increment()"
    >{{ counter.count }}
    </button>
    <h1 class="text-slate-900 dark:text-white">{{
        $t('darkmode.mode', {mode: $t(`darkmode.${$colorMode.preference}`)})
      }}</h1>

  </div>
</template>

<style scoped>

</style>

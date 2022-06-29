<script setup lang="ts">
import {useLangStore} from '~/store/lang';
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import {useColorMode, watch} from "#imports";

const colorMode = useColorMode()

useHead({
  bodyAttrs: {
    class: 'bg-jelly-bean-50 dark:bg-jelly-bean-900 transition duration-500'
  }
})

const langStore = useLangStore()
const i18n = useI18n();

watch(langStore, l => i18n.locale.value = l.lang)

const langs = ['en', 'de']

</script>

<template>
  <h1 class="text-amber-500">{{ $t('other.test') }}</h1>
  <h2 class="text-white">{{ $t('other.varr', {world:'aa'})}}</h2>
  <select v-model="colorMode.preference"
          class="p-1 rounded border
            bg-mexican-red-50
              hover:bg-mexican-red-200
            dark:bg-mexican-red-800 dark:text-white dark:border-zinc-700
              dark:hover:bg-mexican-red-600
            transition duration-300 ease-out">
    <option value="system">{{ $t('darkmode.system') }}</option>
    <option value="light">{{ $t('darkmode.light') }}</option>
    <option value="dark">{{ $t('darkmode.dark') }}</option>
    <option value="sepia">{{ $t('darkmode.sepia') }}</option>
  </select>
  <select v-model="langStore.lang">
    <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
      {{ lang }}
    </option>
  </select>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>

</template>

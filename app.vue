<script setup lang="ts">
import {useLangStore} from '~/store/lang';
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import {defineOrganization, defineWebPage, useColorMode, useHead, useRoute, useSchemaOrg, watch} from "#imports";

const colorMode = useColorMode()

const langStore = useLangStore()
const i18n = useI18n();
i18n.locale.value = langStore.lang
const langs = ['en', 'de']


const route = useRoute()
const appName = 'Accessicity';
const logo = '/logo.png'
const title = route.meta.title ? `${appName} - ${route.meta.title}` : appName
const description = route.meta.description ? route.meta.description : appName
const image = route.meta.image ? route.meta.image : logo

useHead({
  htmlAttrs: {
    lang: i18n.locale
  },
  bodyAttrs: {
    class: 'bg-jelly-bean-50 dark:bg-jelly-bean-900 transition duration-500'
  },
  title,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    {name: 'description', content: description},
    {name: 'og:description', content: description},
    {name: 'og:title', content: title},
    {name: 'og:image', content: image},
    {name: 'og:site_name', content: appName}
  ],
})


watch(langStore, l => i18n.locale.value = l.lang)


useSchemaOrg([
  defineOrganization({
    name: appName,
    logo
  }),
  defineWebPage({
    name: title,
    description,
    inLanguage: langs,
    image
  }),
])
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

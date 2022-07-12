<script lang="ts" setup>
import {useLangStore} from '~/store/lang';
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import {defineOrganization, defineWebPage, useColorMode, useHead, useRoute, useSchemaOrg, watch} from "#imports";
import {useAuthStore} from "~/store/auth";

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
    class: 'bg-main dark:bg-primary transition duration-500'
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
const auth = useAuthStore()
const shown = ref(false)
</script>

<template>
  <!--  <h1 class="text-amber-500">{{ $t('other.test') }}</h1>-->
  <!--  <h2 class="text-white">{{ $t('other.varr', {world: 'aa'}) }}</h2>-->
  <!--  <button v-if="auth.user" class="dark:bg-white p-3 ml-3 rounded" @click.prevent="auth.logout()">Logout</button>-->
  <!--  <NuxtLink is="button" v-else :to="{query: {r: route.path}, path: '/login'}" class="dark:bg-white p-3 ml-3 rounded">-->
  <!--    Login-->
  <!--  </NuxtLink>-->
  <NuxtLayout>
    <div class="flex flex-col h-screen">
      <header
          class="py-5 bg-light dark:bg-text md:flex overflow-hidden justify-between items-center border-light dark:border-text border-b-primary dark:border-b-primarydark border-2">
        <div class="pl-5 flex justify-between">
          <NuxtLink to="/">
            <div class="w-[180px] h-[90px] bg-black"/>
          </NuxtLink>
          <div class="text-right md:hidden my-auto p-5 mr-5" @click.prevent="shown = !shown"><span
              class="material-icons-outlined" style="font-size: 48px">menu</span></div>
        </div>
        <div :class="{hidden: !shown}" class="pt-5 md:pt-0 flex-col md:flex-row flex md:flex">
          <NuxtLink class="header-link" to="/explore">{{ $t('header.explore') }}</NuxtLink>
          <NuxtLink class="header-link" to="/ranking">{{ $t('header.ranking') }}</NuxtLink>
          <NuxtLink v-if="auth.user" class="header-link" to="/user">{{ auth.user.name }}</NuxtLink>
          <a v-if="auth.user" class="header-link" href="#" @click.prevent="auth.logout()">{{ $t('header.logout') }}</a>
          <NuxtLink v-else :to="{query: {r: route.path}, path: '/login'}" class="header-link">{{
              $t('header.login')
            }}
          </NuxtLink>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-5">
        <NuxtPage/>
      </main>
      <footer class="pb-5 pt-10 bg-primary text-center">
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
      </footer>
    </div>
  </NuxtLayout>

</template>
<style>
@import 'material-icons/iconfont/outlined.css';
.header-link {
  @apply w-32 text-center text-xl font-light text-text dark:text-light py-2.5 md:py-0 hover:font-normal
}

* {
  @apply transition-colors duration-500
}
</style>

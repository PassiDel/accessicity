<script lang="ts" setup>
import {useLangStore} from '~/store/lang';
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import {
  computed,
  defineOrganization,
  defineWebPage,
  ref,
  useColorMode,
  useHead,
  useRouter,
  useSchemaOrg,
  watch
} from "#imports";
import {useAuthStore} from "~/store/auth";
import 'material-icons/iconfont/outlined.css'
import 'material-icons/iconfont/filled.css'
import '@fontsource/roboto'
import {storeToRefs} from "pinia";

const colorMode = useColorMode()

const {lang} = storeToRefs(useLangStore())

const i18n = useI18n();
i18n.locale.value = lang.value
const langs = ['en', 'de']
const langBtn = () => {
  lang.value = langs.filter(l => l !== lang.value)[0]
}

const colors = [{key: 'dark', icon: 'dark_mode'}, {key: 'light', icon: 'light_mode'}, {
  key: 'system',
  icon: 'devices'
}, {key: 'sepia', icon: 'coffee'}]
const currIndex = ref(colors.findIndex(c => c.key === colorMode.preference))

watch(currIndex, i => {
  colorMode.preference = colors[i].key
})


const {currentRoute} = useRouter()
const appName = 'Accessicity';
const logo = '/logo.png'
const title = computed(() => currentRoute.value.meta.title ? `${appName} - ${currentRoute.value.meta.title.startsWith('t:') ? i18n.t(currentRoute.value.meta.title.slice(2)) : currentRoute.value.meta.title}` : appName)
const description = computed(() => currentRoute.value.meta.description ? currentRoute.value.meta.description : appName)
const image = computed(() => currentRoute.value.meta.image ? currentRoute.value.meta.image : logo)
useHead(computed(() => ({
  htmlAttrs: {
    lang: i18n.locale.value
  },
  bodyAttrs: {
    class: 'bg-main dark:bg-primary transition duration-500'
  },
  title: title.value,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    {name: 'description', content: description.value},
    {name: 'og:description', content: description.value},
    {name: 'og:title', content: title.value},
    {name: 'og:image', content: image.value},
    {name: 'og:site_name', content: appName}
  ],
  link: [
    {rel: 'icon', type: 'image/x-icon', href: logo},
    {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
    {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
    {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
    {rel: 'manifest', href: '/site.webmanifest'},
  ]
})))


watch(lang, l => i18n.locale.value = l)


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
    <div class="flex flex-col h-screen">
      <header
          class="bg-light dark:bg-primary md:flex overflow-hidden justify-between items-center border-light dark:border-primary border-b-primary dark:border-b-primarydark border-2">
        <div class="pl-5 flex justify-between">
          <NuxtLink to="/">
            <Logo class="w-[180px] h-[90px]"/>
          </NuxtLink>
          <div class="text-right md:hidden my-auto p-5 mr-5 cursor-pointer" @click.prevent="shown = !shown"><span
              class="material-icons-outlined" style="font-size: 48px">menu</span></div>
        </div>
        <div :class="{hidden: !shown}" class="pt-5 md:pt-0 flex-col md:flex-row flex md:flex items-center">
          <NuxtLink class="header-link" to="/explore">{{ $t('header.explore') }}</NuxtLink>
          <NuxtLink class="header-link" to="/ranking">{{ $t('header.ranking') }}</NuxtLink>
          <NuxtLink v-if="auth.user" class="header-link" to="/user">{{ auth.user.name }}</NuxtLink>
          <a v-if="auth.user" class="header-link" href="#" @click.prevent="auth.logout()">{{ $t('header.logout') }}</a>
          <NuxtLink v-else :to="{query: {r: currentRoute.path}, path: '/login'}" class="header-link">{{
              $t('header.login')
            }}
          </NuxtLink>
          <div class="header-btn flex justify-evenly">
            <div class="rounded-full border-2
            bg-white hover:bg-gray-100 border-gray-100 hover:border-gray-200
            dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900
            duration-300 w-12 h-12 flex justify-center items-center cursor-pointer transition hover:shadow-xl dark:shadow-gray-800"
                 @click="currIndex = (currIndex + 1) % colors.length"
            >
              <span :title="$t(`darkmode.${colors[currIndex].key}`)"
                    class="material-icons-outlined">{{ colors[currIndex].icon }}</span>
            </div>
            <div :class="{de: lang === 'de', en: lang === 'en'}"
                 class="rounded-full duration-300 w-12 h-12 cursor-pointer transition hover:shadow-xl dark:shadow-gray-800"
                 @click="langBtn()"
            ></div>
          </div>
        </div>
      </header>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
      <footer class="pb-5 pt-5 bg-primary dark:bg-primarydark text-center">
        <router-link class="footer-link" to="/imprint">{{ $t('legal.imprint') }}</router-link>
        <router-link class="footer-link" to="/privacy">{{ $t('legal.privacy') }}</router-link>
      </footer>
    </div>
</template>
<style>
.header-link {
  @apply w-32 text-center text-xl font-light text-primary dark:text-light py-2.5 md:py-0 hover:font-normal
}

.header-btn {
  @apply w-32 text-center text-xl font-light text-primary dark:text-light py-2.5 md:py-0
}

.footer-link {
  @apply px-2 dark:text-buttondark text-button hover:underline
}

/* based on https://pixelastic.github.io/css-flags/ */
.de {
  background: linear-gradient(180deg, #000 0, #000 33%, #FF0000 33%, #FF0000 67%, #FFCC00 67%, #FFCC00 100%);
}

.en {
  background: linear-gradient(180deg,
  #ba0c2f 0%, #ba0c2f 20%,
  #FFF 20%, #FFF 40%,
  #ba0c2f 40%, #ba0c2f 60%,
  #FFF 60%, #FFF 80%,
  #ba0c2f 80%, #ba0c2f 100%);
}

.en:before {
  @apply w-6 h-6;
  content: "";
  display: block;
  position: relative;
  background-color: #012169;
  left: 0;
  top: 0;
  border-top-left-radius: 1.5rem;
}

.en:after {
  color: transparent;
  content: "★";
  font-size: 7px;
  height: 7px;
  line-height: 7px;
  text-align: center;
  position: relative;
  width: 7px;
  top: -45px;
  left: -26px;
  text-shadow: 20px 10px 0 #fff, 15px 15px 0 #fff, 20px 20px #fff, 10px 10px 0 #fff, 10px 20px 0 #fff;
}

* {
  @apply transition-colors duration-500
}
</style>

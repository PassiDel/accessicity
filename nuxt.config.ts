import { defineNuxtConfig } from 'nuxt'
import {IntlifyModuleOptions} from "@intlify/nuxt3";

declare module '@nuxt/schema' {
    interface NuxtConfig {
        intlify?: IntlifyModuleOptions
    }
}
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    buildModules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@pinia/nuxt',
        '@intlify/nuxt3'
    ],
    tailwindcss: {
        exposeConfig: true
    },
    colorMode: {
        classSuffix: ''
    },
    intlify: {
        localeDir: 'locales',
        vueI18n: {
            locale: 'en',
            fallbackLocale: 'en',
            availableLocales: ['en', 'de'],
        },
    }

})

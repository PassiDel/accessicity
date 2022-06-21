import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    buildModules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode'
    ],
    tailwindcss: {
        exposeConfig: true
    },
    colorMode: {
        classSuffix: ''
    }

})

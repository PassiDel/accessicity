import {addRouteMiddleware, defineNuxtPlugin, navigateTo} from "#imports";
import {useAuthStore} from "~/store/auth";

export default defineNuxtPlugin(nuxt => {
    const auth = useAuthStore(nuxt.$pinia)

    addRouteMiddleware('noauth', () => {
        if (auth.user) {
            return navigateTo('/', {redirectCode: 302})
        }
    })

    addRouteMiddleware('auth', to => {
        if (!auth.user) {
            return navigateTo({path: '/login', query: {r: to.path}}, {redirectCode: 302})
        }
    })
})

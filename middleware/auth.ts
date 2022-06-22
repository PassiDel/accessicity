import {abortNavigation, defineNuxtRouteMiddleware, navigateTo} from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.params.id === '1') {
        return abortNavigation()
    }
    return navigateTo('/login')
})

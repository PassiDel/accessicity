import {defineNuxtRouteMiddleware, navigateTo} from "#imports";
import {useAuthStore} from "~/store/auth";

const auth = useAuthStore()
export default defineNuxtRouteMiddleware((to) => {
    if (!auth.user) {
        return navigateTo({path: '/login', query: {r: to.path}}, {redirectCode: 302})
    }
})

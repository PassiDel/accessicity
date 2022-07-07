import {defineNuxtRouteMiddleware, navigateTo} from "#imports";
import {useAuthStore} from "~/store/auth";

const auth = useAuthStore()
export default defineNuxtRouteMiddleware(() => {
    if (auth.user) {
        return navigateTo('/', {redirectCode: 302})
    }
})

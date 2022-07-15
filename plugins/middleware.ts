import {addRouteMiddleware, navigateTo} from "#imports";
import {useAuthStore} from "~/store/auth";

export default function ({$pinia}) {

    addRouteMiddleware('noauth', () => {
        const auth = useAuthStore($pinia)
        if (auth.user) {
            return navigateTo('/', {redirectCode: 302})
        }
    })

    addRouteMiddleware('auth', to => {
        const auth = useAuthStore($pinia)
        if (!auth.user) {
            return navigateTo({path: '/login', query: {r: to.path}}, {redirectCode: 302})
        }
    })
}

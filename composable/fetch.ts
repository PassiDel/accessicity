import {useAuthStore} from "~/store/auth";
import {useFetch, useLazyFetch} from "#imports";
import {UseFetchOptions} from "#app";
import {Ref} from "@vue/reactivity";

export const useFetchWithHeader = (url: string | Ref<string> | (() => string), opts?: UseFetchOptions<any>) => {
    let headers = {}

    const auth = useAuthStore()
    if (auth.user) {
        headers['authorization'] = `Bearer ${auth.user.token}`
    }

    return useFetch(url, {
        ...opts,
        headers
    })
}

export const useLazyFetchWithHeader = (url: string | Ref<string> | (() => string), opts?: UseFetchOptions<any>) => {
    let headers = {}

    const auth = useAuthStore()
    if (auth.user) {
        headers['authorization'] = `Bearer ${auth.user.token}`
    }

    return useLazyFetch(url, {
        ...opts,
        headers
    })
}

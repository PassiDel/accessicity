import {useAuthStore} from "~/store/auth";
import {useFetch, useLazyFetch} from "#imports";
import {UseFetchOptions} from "#app";

export const useFetchWithHeader = (url: string, opts?: UseFetchOptions<any>) => {
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

export const useLazyFetchWithHeader = (url: string, opts?: UseFetchOptions<any>) => {
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

import {useAuthStore} from "~/store/auth";
import {useFetch} from "#imports";
import {UseFetchOptions} from "#app";

export const useFetchWithHeader = (url: string, opts?: UseFetchOptions<any>) => {
    let headers = {}

    const auth = useAuthStore()
    if (auth.user) {
        headers['authorization'] = `Bearer ${auth.user.token}`
    }

    console.log(process.server, url, {
        ...opts,
        headers
    })

    return useFetch(url, {
        ...opts,
        headers
    })
}

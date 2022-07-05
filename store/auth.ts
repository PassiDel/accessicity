import {defineStore} from "pinia";

interface LoginPayload {
    id: number,
    name: string,
    email: string,
    token: string,
    role?: string
}

interface IAuthState {
    user?: LoginPayload
}

export const useAuthStore = defineStore('auth', {
    state: (): IAuthState => {
        return {
            user: null
        }
    },
    actions: {
        login(data: LoginPayload) {
            this.user = data
        },
        logout() {
            this.user = null
        }
    }
})

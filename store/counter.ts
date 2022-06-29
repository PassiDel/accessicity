import {defineStore} from "pinia";

interface ICounterState {
    count: number
}
export const useCounterStore = defineStore('counter', {
    state: (): ICounterState => {
        return {
            count: 0
        }
    },
    actions: {
        increment(inc = 1) {
            this.count += inc
        }
    }
})

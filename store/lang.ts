import {defineStore} from "pinia";
import {ref, watch} from "#imports";
import {useI18n} from "vue-i18n";


export const useLangStore = defineStore('lang', {
        state: () => {
            return {
                lang: 'en'
            }
        },
        actions: {
        },
    persistedState: {
            migrate: state => {
                // set the language for SSR
                const i18n = useI18n()
                i18n.locale.value = state.lang

                return state
            }
    }
    }
)
// $i18n.locale


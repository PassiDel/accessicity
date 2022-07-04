import {defineStore} from "pinia";
import {useRequestHeaders} from "#imports";
import {useI18n} from "vue-i18n";
import parser from "accept-language-parser";


export const useLangStore = defineStore('lang', {
        state: () => {
            if (process.server) {
                const lang = useRequestHeaders(['accept-language'])?.["accept-language"] ?? 'en'
                const langSelect = parser.pick(['en', 'de'], lang)
                return {
                    lang: langSelect
                }
            }
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


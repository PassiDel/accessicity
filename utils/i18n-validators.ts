import {
    createI18nMessage,
    email as _email,
    maxLength as _maxLength,
    minLength as _minLength,
    required as _required
} from '@vuelidate/validators'

export const required = (i18n) => createI18nMessage({t: i18n.t.bind(i18n)})(_required)
export const email = (i18n) => createI18nMessage({t: i18n.t.bind(i18n)})(_email)
export const minLength = (i18n, value) => createI18nMessage({t: i18n.t.bind(i18n)})(_minLength(value))
export const maxLength = (i18n, value) => createI18nMessage({t: i18n.t.bind(i18n)})(_maxLength(value))
export const checked = (i18n) => createI18nMessage({t: i18n.t.bind(i18n)})(value => value === true)

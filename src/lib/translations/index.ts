import emojiFlags from 'emoji-flags'
import i18n, {type Config} from 'sveltekit-i18n'

type ParserPayload = {[key: string]: number | string}

/**
 * Map of available locals. For each locale, there is a country flag,
 * as well as the name of the language, writen in the same language for easy recognition
 *
 * Each is listed in the setting by this name
 */
export const availableLocales: Record<string, [name: string, flag: emojiFlags.CountryData['emoji']]> = {
    en: ['English', emojiFlags.GB.emoji],
    de: ['Deutsch', emojiFlags.DE.emoji],
    es: ['Español', emojiFlags.ES.emoji]
}
export const fallbackLocale = 'en'

const localeFiles = import.meta.glob('./*/*.json')

const localeFileKeys = ['countries', 'regions', 'ui', 'achievements']

/**
 * Gathers translations according to locales and keys defined above.
 * In case of errors/warnings, ensure the right json files for the language exist, according to the
 * same schema as they do for 'en'
 */
const loaders: Config['loaders'] = Array.from(Object.keys(availableLocales)).flatMap(locale =>
    localeFileKeys.map(key => ({
        locale,
        key,
        loader: localeFiles[`./${locale}/${locale}.${key}.json`] as () => Promise<object>
    }))
)

const translationConfig: Config<ParserPayload> = {
    initLocale: fallbackLocale,
    fallbackLocale,
    loaders
}

export const {t, locale, locales, loading, loadTranslations} = new i18n(translationConfig)

import { get } from 'lodash'

export class LocaleTextUtil {
    public static resolve(localeText, language: string = 'en') {
        return get(localeText, language) || get(localeText, 'en')
    }
}
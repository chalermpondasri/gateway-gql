import {
    registerEnumType,
} from '@nestjs/graphql'

export enum Locale {
    TH='th',
    EN='en',
    CN='cn'
}

export enum Off {
    OFF='off'
}

export const SubtitleSelection = Object.assign({},Off,Locale)


registerEnumType(Locale, {
    name: 'Locale',
    description: 'Supported localization'
})

registerEnumType(SubtitleSelection, {
    name: 'SubtitleSelection'
})
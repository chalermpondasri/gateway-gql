import { registerEnumType } from '@nestjs/graphql';

export enum ContentRating {
    GENERAL = 'GENERAL',
    KIDS_3P = 'KIDS_3P',
    KIDS_6P = 'KIDS_6P',
    MATURE_13P = 'MATURE_13P',
    MATURE_18P = 'MATURE_18P',
    NO_RESTRICT = 'NO_RESTRICT',
}

registerEnumType(ContentRating, {
    name: 'ContentRating',
})

export class ContentRatingValidation {
    private readonly _validationTable: Map<ContentRating, ContentRating[]>
    public constructor() {
        this._validationTable = new Map<ContentRating, ContentRating[]>()

        this._validationTable.set(ContentRating.NO_RESTRICT, [
            ContentRating.NO_RESTRICT,
            ContentRating.GENERAL,
            ContentRating.KIDS_3P,
            ContentRating.KIDS_6P,
            ContentRating.MATURE_18P,
            ContentRating.MATURE_13P,
        ])

        this._validationTable.set(ContentRating.KIDS_3P, [ContentRating.KIDS_3P])

        this._validationTable.set(ContentRating.KIDS_6P, [ContentRating.KIDS_3P, ContentRating.KIDS_6P])

        this._validationTable.set(ContentRating.GENERAL, [
            ContentRating.GENERAL,
            ContentRating.KIDS_3P,
            ContentRating.KIDS_6P,
        ])

        this._validationTable.set(ContentRating.MATURE_13P, [ContentRating.GENERAL, ContentRating.MATURE_13P])
        this._validationTable.set(ContentRating.MATURE_18P, [
            ContentRating.GENERAL,
            ContentRating.MATURE_13P,
            ContentRating.MATURE_18P,
        ])
    }

    public isAllowed(reference: ContentRating, subject: ContentRating) {
        return this._validationTable.get(reference).some((v) => v === subject)
    }

    public getValue(reference: ContentRating): ContentRating[] {
        return this._validationTable.get(reference)
    }
}
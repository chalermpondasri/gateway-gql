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
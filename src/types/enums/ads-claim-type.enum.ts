import { registerEnumType } from '@nestjs/graphql'

export enum AdsClaimType {
    SKIP = 'SKIP',
    VISIT = 'VISIT',
    NO_VISIT = 'NO_VISIT',
}

registerEnumType(AdsClaimType, {
    name: 'AdsClaimType',
})
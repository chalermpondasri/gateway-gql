import {
    Field,
    InputType,
} from '@nestjs/graphql'
import { AdsClaimType } from '@/types/enums/ads-claim-type.enum'

@InputType()
export class AdsTokenClaimInput {
    @Field()
    public adsToken: string
    @Field(() => AdsClaimType)
    public claimType: AdsClaimType
    @Field(() => Number)
    public watchingDuration: number
}
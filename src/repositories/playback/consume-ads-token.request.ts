import { AdsClaimType } from '@/types/enums/ads-claim-type.enum'
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
} from 'class-validator'

export class ConsumeAdsTokenRequest {
    @IsNotEmpty()
    public adsToken: string
    @IsEnum(AdsClaimType)
    public claimType: AdsClaimType
    @IsNumber()
    public watchingDuration: number
}
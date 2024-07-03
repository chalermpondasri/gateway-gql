import {
    Args,
    Mutation,
    Resolver,
} from '@nestjs/graphql'
import { PlaybackService } from '@/services/playback/playback.service'
import { Inject } from '@nestjs/common'
import { AdsTokenClaimInput } from '@/types/inputs/ads-token-claim.input'

@Resolver()
export class AdsResolver {
    public constructor(
        @Inject(PlaybackService)
        private readonly _playbackService: PlaybackService
    ) {

    }

    @Mutation(() => String)
    public consumeAdsToken(
        @Args(AdsTokenClaimInput.name) adsClaimInput: AdsTokenClaimInput,
    ) {
        return this._playbackService.consumeAdsToken(adsClaimInput)
    }

}
import {
    Args,
    Mutation,
    Resolver,
} from '@nestjs/graphql'
import { PlaybackService } from '@/services/playback/playback.service'
import { Inject } from '@nestjs/common'

@Resolver()
export class AdsResolver {
    public constructor(
        @Inject(PlaybackService)
        private readonly _playbackService: PlaybackService
    ) {

    }

    @Mutation(() => String)
    public consumeAdsToken(
        @Args('adsToken') adsToken: string,
    ) {
        return this._playbackService.consumeAdsToken(adsToken)
    }

}
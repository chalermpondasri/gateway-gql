import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import { Observable } from 'rxjs'
import { AdsTokenClaimInput } from '@/types/inputs/ads-token-claim.input'
import { instanceToInstance } from 'class-transformer'
import { ConsumeAdsTokenRequest } from '@/repositories/playback/consume-ads-token.request'

@Injectable()
export class PlaybackService {
    public constructor(
        @Inject(ProviderName.PLAYBACK_REPOSITORY)
        private readonly _playbackRepository: IPlaybackRepository
    ) {

    }

    public consumeAdsToken(input: AdsTokenClaimInput): Observable<string> {
        const request = instanceToInstance<ConsumeAdsTokenRequest>(input)
        return this._playbackRepository.consumeAdsToken(request)
    }

}
import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import { Observable } from 'rxjs'

@Injectable()
export class PlaybackService {
    public constructor(
        @Inject(ProviderName.PLAYBACK_REPOSITORY)
        private readonly _playbackRepository: IPlaybackRepository
    ) {

    }

    public consumeAdsToken(adsToken: string): Observable<string> {
        return this._playbackRepository.consumeAdsToken(adsToken)
    }

}
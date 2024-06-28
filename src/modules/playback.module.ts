import { Module } from '@nestjs/common'
import { playbackRepositoryProvider } from '@/providers/playback.provider'
import { PlaybackService } from '@/services/playback/playback.service'
import { AdsResolver } from '@/services/playback/ads.resolver'

@Module({
    providers: [
        playbackRepositoryProvider,
        PlaybackService,
        AdsResolver,
    ],
    exports: [
        playbackRepositoryProvider,
        PlaybackService,
        AdsResolver,
    ]
})
export class PlaybackModule {}
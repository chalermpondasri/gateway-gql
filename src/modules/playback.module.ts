import { Module } from '@nestjs/common'
import { playbackRepositoryProvider } from '@/providers/playback.provider'

@Module({
    providers: [
        playbackRepositoryProvider,
    ],
    exports: [
        playbackRepositoryProvider,
    ]
})
export class PlaybackModule {}
import { PlaybackState } from '@/types/enums/playback-state.enum'

export class UpdatePlaybackStatusRequest {
    public mediaContentId: string
    public mediaEpisodeId: string
    public watchingAt: number
    public playbackState: PlaybackState
}
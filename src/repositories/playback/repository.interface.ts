import { Observable } from 'rxjs'
import { UpdatePlaybackStatusRequest } from '@/repositories/playback/update-playback-status.request'
import { LatestPlayedContentResponse } from '@/repositories/playback/latest-played-content.response'

export interface IPlaybackRepository {
    getPlaybackStatus(profileId: string, mediaContentId: string): Observable<{ [episodeId: string]: number }>
    updatePlaybackStatus(profileId: string, body: UpdatePlaybackStatusRequest): Observable<string>
    getLatestPlayedContent(profileId: string): Observable<LatestPlayedContentResponse[]>
}
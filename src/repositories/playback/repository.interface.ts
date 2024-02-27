import { Observable } from 'rxjs'
import { UpdatePlaybackStatusRequest } from '@/repositories/playback/update-playback-status.request'

export interface IPlaybackRepository {
    getPlaybackStatus(profileId: string, mediaContentId: string): Observable<{ [episodeId: string]: number }>
    updatePlaybackStatus(profileId: string, body: UpdatePlaybackStatusRequest): Observable<string>
}
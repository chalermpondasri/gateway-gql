import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { UpdatePlaybackStatusRequest } from './update-playback-status.request';
import { AxiosInstance } from 'axios'

export class PlaybackRepository implements IPlaybackRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance
    ) {
    }

    public getPlaybackStatus(profileId: string, mediaContentId: string): Observable<{ [episodeId: string]: number; }> {
        const promise = this._axiosInstance.get(`/playback/progress/${profileId}?mediaContentId=${mediaContentId}`)
        return from(promise).pipe(
            map( res => res.data)
        )
    }

    public updatePlaybackStatus(profileId: string, body: UpdatePlaybackStatusRequest): Observable<string> {
        const promise = this._axiosInstance.patch(`/playback/progress/${profileId}`, body)
        return from(promise).pipe(
            map( res => res.data)
        )
    }
}
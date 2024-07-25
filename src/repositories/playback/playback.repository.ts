import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { UpdatePlaybackStatusRequest } from './update-playback-status.request'
import { AxiosInstance } from 'axios'
import { LatestPlayedContentResponse } from '@/repositories/playback/latest-played-content.response'
import { plainToInstance } from 'class-transformer'
import { ConsumeAdsTokenRequest } from '@/repositories/playback/consume-ads-token.request'

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

    public getLatestPlayedContent(profileId: string): Observable<LatestPlayedContentResponse[]> {
        return from(this._axiosInstance.get(`/playback/latest/${profileId}`)).pipe(
            map( res => <unknown[]>res.data),
            map((data: unknown[]) => plainToInstance(LatestPlayedContentResponse, data)),
        )
    }

    public consumeAdsToken(input: ConsumeAdsTokenRequest): Observable<string> {
        return from(this._axiosInstance.post('/playback/ads/consume', input)).pipe(
            map(res => res.data)
        )
    }

    public updateBufferedSizeUsage(videoId: string, bufferUsage: number): Observable<string> {
        return from(this._axiosInstance.post('/stats/video', {videoId,bufferUsage})).pipe(
            map(res => res.data)
        )
    }
}
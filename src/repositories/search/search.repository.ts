import { ISearchRepository } from '@/repositories/search/repository.interface'
import { AxiosInstance } from 'axios'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { PaginationQueryRequest, ListResponse } from '../auth'
import { MediaContentDetailResponse, MediaContentResponse } from '../cms'

export class SearchRepository implements ISearchRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
    ) {
    }

    public findMediaContentWithKeyword(query: PaginationQueryRequest): Observable<ListResponse<MediaContentDetailResponse>> {
        const data = {
            limit: query.limit,
            page: query.page,
            keyword: query.query
        }
        return from(this._axiosInstance.get(`/search/media-contents`,{data})).pipe(
            map(result => result.data)
        )
    }
}
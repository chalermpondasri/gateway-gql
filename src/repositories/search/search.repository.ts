import { ISearchRepository } from '@/repositories/search/repository.interface'
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import {
    PaginationQueryRequest,
    ListResponse,
} from '../auth'
import { SearchMediaContentResonse } from './search.response'
import _, {
    isNil,
    omitBy,
} from 'lodash'

export class SearchRepository implements ISearchRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
    ) {
    }

    public getTopsViews(startDate: string, endDate: string, tagSlugs: string[]): Observable<{
        contentId: number;
        accumulatedWatchTime: number
    }[]> {
        const params = omitBy({
            startDate, endDate, tagSlugs,
        }, isNil)

        return from(this._axiosInstance.get(`/search/tops`, { params })).pipe(
            map(result => result.data)
        )

    }

    public findMediaContentWithKeyword(query: PaginationQueryRequest, profileId: string): Observable<ListResponse<SearchMediaContentResonse>> {
        const data = {
            limit: query.limit,
            page: query.page,
            keyword: query?.query ?? '',
            profileId: profileId,
        }
        const queryString = querystring.encode(data)
        return from(this._axiosInstance.get(`/search/media-contents?${queryString}`)).pipe(
            map(result => result.data),
        )
    }
}
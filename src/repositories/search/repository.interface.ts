import { Observable } from 'rxjs'
import {
    ListResponse,
    PaginationQueryRequest,
} from '@/models/common'
import { SearchMediaContentResponse } from './search.response'

export interface ISearchRepository {
    findMediaContentWithKeyword(query: PaginationQueryRequest, profileId: string): Observable<ListResponse<SearchMediaContentResponse>>
    getTopsViews(startDate: string, endDate: string, tagSlugs: string[]): Observable<Array<{contentId: number,accumulatedWatchTime: number}>>
    getRelatedContentByContentId(contentId: string):Observable<ListResponse<SearchMediaContentResponse>>
    getSuggestionByProfileId(profileId: string):Observable<ListResponse<SearchMediaContentResponse>>
}
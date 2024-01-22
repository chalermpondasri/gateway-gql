import { Observable } from 'rxjs'
import {
    ListResponse,
    PaginationQueryRequest,
} from '@/models/common'
import { SearchMediaContentResonse } from './search.response'

export interface ISearchRepository {
    findMediaContentWithKeyword(query: PaginationQueryRequest, profileId: string): Observable<ListResponse<SearchMediaContentResonse>>
}
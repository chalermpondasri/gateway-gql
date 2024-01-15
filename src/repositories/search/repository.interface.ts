import { Observable } from 'rxjs'

import { MediaContentResponse } from '@/repositories/cms'
import {
    ListResponse,
    PaginationQueryRequest,
} from '@/models/common'

export interface ISearchRepository {
    findMediaContentWithKeyword(query: PaginationQueryRequest): Observable<ListResponse<MediaContentResponse>>
}
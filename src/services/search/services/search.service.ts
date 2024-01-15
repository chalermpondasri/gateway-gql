import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { ISearchRepository } from '@/repositories/search'
import {
    concatMap,
    filter,
    from,
    iif,
    map,
    mergeMap,
    Observable,
    of,
    pipe,
} from 'rxjs'
import { MediaContentType } from '@/types/objects'
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { IAuthRepository } from '@/repositories/auth'
import { isNil } from 'lodash'

@Injectable()
export class SearchService {
    public constructor(
        @Inject(ProviderName.SEARCH_REPOSITORY)
        private readonly _searchRepository: ISearchRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
    ) {
    }


    // TODO
    public searchContentByKeyword(query: SearchInput): Observable<MediaContentType[]> {
        const getProfile$ = this._authRepository.getProfileById(query.profileId).pipe(
            map(response => {
                response.contentRating
            })
        )
        return iif(() => !isNil(SearchInput),getProfile$, of({}) ).pipe(
            mergeMap( profile => {
                return this._searchRepository.findMediaContentWithKeyword(query).pipe(
                    concatMap(result => from(result.data)),
                    filter(value => {

                    }),
                    map(),
                )
            })
        )

    }

}
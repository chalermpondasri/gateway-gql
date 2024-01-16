import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { ISearchRepository } from '@/repositories/search'
import { 
    concatMap,
    from,
    map, 
    Observable,
    toArray,
} from 'rxjs'
import { MediaContentDetailType} from '@/types/objects'
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { IAuthRepository } from '@/repositories/auth'
import { get } from 'lodash'
import { SearchContentType } from '@/types/objects/search.type'

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

    public searchContentByKeyword(query: SearchInput): Observable<SearchContentType[]> {
        const lang = this._requestContext.languages[0].code
        return this._searchRepository.findMediaContentWithKeyword(query, query.profileId).pipe(
            concatMap(data=> from(data.data)),
            map(content => {   
                const mediaContent: SearchContentType = {
                    id: content.id,
                    coverImage: content.coverImage as any,
                    contentRating: content.rating,
                    title: get(content, `title.${lang}`, content.title.en),
                    tags: get(content, `mediaTags`, []).map(e=> ({id: e.slug, label: e.name[lang]})),
                    trailers: get(content, 'trailers', [])
                }
                return mediaContent
            }),
            toArray()
        )
    }

}
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

    public searchContentByKeyword(query: SearchInput): Observable<MediaContentDetailType[]> {
        const lang = this._requestContext.languages[0].code
        return this._searchRepository.findMediaContentWithKeyword(query, query.profileId).pipe(
            concatMap(data=> from(data.data)),
            map(content => {   
                const mediaContent: MediaContentDetailType = {
                    title: get(content, `title.${lang}`, content.title.en),
                    contentRating: content.rating,
                    shortVideos: [],
                    trailers: [],
                    coverImage: content.coverImage as any,
                    link: null,
                    tags: content.mediaTags.map(e => ({ id: e, label: e })),
                    episodes: [],
                    isSeries: false,
                    totalEpisode: 0,
                    totalSeason: 0,
                    slug: content.slug,
                    id: content.id,
                    subtitle: '',
                    captions: [],
                    audios: [],
                    seasons: []
                }
                return mediaContent
            }),
            toArray()
        )
    }

}
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
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { IAuthRepository } from '@/repositories/auth'
import { get } from 'lodash'
import { MediaContentDetailType } from '@/types/objects'

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
                const media: MediaContentDetailType = {
                    id: content.id,
                    title: get(content, `title.${lang}`, content.title.en),
                    subtitle: get(content,`title.${lang}`, content.subtitle.en),
                    contentRating: get(content,'rating', ''),
                    trailers: get(content, 'trailers', []),
                    coverImage:  content.coverImage as any,
                    slug: get(content,'slug', ''),
                    tags: get(content, `mediaTags`, []).map(e=> ({id: e.slug, label: e.name[lang]})),
                    captions: [],
                    shortVideos: [],
                    link: get(content,'link'),
                    casts:get(content,'casts'),
                    director:get(content,'directors'),
                    episodes: [],
                    //resolve
                    isSeries: false,
                    audios: [],
                    seasons: [],
                    totalEpisode: 0,
                    totalSeason: 0,
                }
                return media
            }),
            toArray()
        )
    }

}
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
import { get } from 'lodash'
import { ExternalContentType, MediaContentDetailType } from '@/types/objects'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class SearchService {
    public constructor(
        @Inject(ProviderName.SEARCH_REPOSITORY)
        private readonly _searchRepository: ISearchRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
    ) {
    }

    public searchContentByKeyword(query: SearchInput): Observable<MediaContentDetailType[]> {
        const lang = this._requestContext.languages[0].code
        return this._searchRepository.findMediaContentWithKeyword(query, this._requestContext.profileId).pipe(
            concatMap(data=> from(data.data)),
            map(content => {  
                const link = get(content,'link', {})
                const media: MediaContentDetailType = {
                    id: content.id,
                    title: get(content, `title.${lang}`),
                    subtitle: get(content,`title.${lang}`),
                    contentRating: get(content,'rating', ''),
                    trailers: get(content, 'trailers', []).map(e => plainToInstance(ExternalContentType, e)),
                    coverImage:  content.coverImage as any,
                    slug: get(content,'slug', ''),
                    tags: get(content, `mediaTags`, []).map(e=> ({id: get(e,'slug',''), label: get(e,`name.${lang}`,'')})),
                    shortVideos: [],
                    link: plainToInstance(ExternalContentType, link),
                    casts:get(content,'casts'),
                    director:get(content,'directors'),
                    //! move to season
                    episodes: [],
                    //* resolve field
                    isSeries: false,
                    audios: null,
                    captions: null,
                    seasons: null,
                    totalEpisode: null,
                    totalSeason: null,
                    totalDuration: null,
                    latestPlayed: null,
                }
                return media
            }),
            toArray()
        )
    }

}
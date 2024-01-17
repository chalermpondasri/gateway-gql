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
    mergeMap, 
    Observable,
    of,
    toArray,
} from 'rxjs'
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { IAuthRepository } from '@/repositories/auth'
import { get } from 'lodash'
import { SearchContentType } from '@/types/objects/search.type'
import { ICmsRepository } from '@/repositories/cms'
import { CacheName, ICacheService } from '@/services/cache/interface/service.interface'

@Injectable()
export class SearchService {
    public constructor(
        @Inject(ProviderName.SEARCH_REPOSITORY)
        private readonly _searchRepository: ISearchRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
    ) {
    }

    public searchContentByKeyword(query: SearchInput): Observable<SearchContentType[]> {
        const lang = this._requestContext.languages[0].code
        return this._cacheService.getCache(CacheName.MEDIA_TAG).pipe(
            mergeMap(tagsString=>{
                if(!! tagsString) return of(<{[name: string]: [slug: string]}>JSON.parse(tagsString))

                return this._cmsRepository.getTags().pipe(
                    map((data)=>{
                        const tagReduce = data.reduce<{[name: string]: [slug: string]}>((a,c)=>{
                             Object.values(c.attributes.name).filter(e=> !Number.isInteger(e)).forEach(e=>{
                                 Object.assign(a,{[e]: c.attributes.slug})
                             })
                             return a
                         },{})
                        this._cacheService.setCache(CacheName.MEDIA_TAG, JSON.stringify(tagReduce), 43_200)                               
                         return tagReduce
                     }),
                )
            }),
            mergeMap((media)=> {
            //    console.log(media);              
               return this._searchRepository.findMediaContentWithKeyword(query, query.profileId)
            }),
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
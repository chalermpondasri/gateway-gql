import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { ISearchRepository } from '@/repositories/search'
import { 
    map, 
    Observable,
} from 'rxjs'
import { MediaContentDetailType} from '@/types/objects'
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { IAuthRepository } from '@/repositories/auth'
import { plainToInstance } from 'class-transformer'

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
        return this._searchRepository.findMediaContentWithKeyword(query).pipe(
            map(data=>{
                return plainToInstance(MediaContentDetailType, <object[]>data.data)
            })
        )
    }

}
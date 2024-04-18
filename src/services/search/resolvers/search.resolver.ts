import {
    Query,
    Resolver,
} from '@nestjs/graphql'
import { SearchService } from '@/services/search/services/search.service'
import { Inject } from '@nestjs/common'
import { MediaContentDetailType } from '@/types/objects'

@Resolver()
export class SearchResolver {
    public constructor(
        @Inject(SearchService)
        private readonly _searchService: SearchService
    ) {
    }
    @Query(() => [MediaContentDetailType])
    public getGeneralTopList() {
        return this._searchService.getGeneralTopViews()
    }
}
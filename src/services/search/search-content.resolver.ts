import { SearchInput } from '@/types/inputs/search.input';
import { SearchContentType } from '@/types/objects/search.type';
import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { SearchService } from './services/search.service';
import { CmsService } from '../doofin-cms/cms.service';
import { MediaContentDetailType } from '@/types/objects';

@Resolver(()=> SearchContentType)
export class SearchContentResolver {
    public constructor(
        @Inject(SearchService) private readonly _searchService: SearchService,
        @Inject(CmsService) private readonly _cmsService: CmsService,
    ){}

    @Query(()=> [ SearchContentType ])
    public searchContentByKeyword(
        @Args(SearchInput.name) input: SearchInput,
    ){
        return this._searchService.searchContentByKeyword(input)
    }

    @ResolveField('mediaContentDetail', () => MediaContentDetailType)
    public mediaContentDetail(
        @Parent() parent: SearchContentType,
    ) {
        return this._cmsService.getMediaContentById(parent.id.toString())
    }
}
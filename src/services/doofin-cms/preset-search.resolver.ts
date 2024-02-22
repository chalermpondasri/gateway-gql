import {
    Args,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import {
    MediaContentDetailType,
    PresetSearchType,
} from '@/types/objects'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'

@Resolver(() => PresetSearchType)
export class PresetSearchResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }

    @Query(() => [PresetSearchType])
    public presetSearches(
        @Args('presetId', {nullable: true, type: () => Number}) presetId: number
    ): Observable<PresetSearchType[]> {
        return this._cmsService.getPresetSearches(presetId)
    }

    @ResolveField('contents', () => [MediaContentDetailType])
    public contents(
        @Parent() parent: PresetSearchType,
    ) {
        const includeTagsId = parent.includeTags.map( v => v.id)
        const excludeTagsId = parent.excludeTags.map(v => v.id)
        return this._cmsService.getMediaContentByTags(includeTagsId, excludeTagsId)
    }
}
import {
    Args,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import {
    MediaContentDetailType,
} from '@/types/objects'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { Inject } from '@nestjs/common'
@Resolver(() => MediaContentDetailType)
export class MediaContentDetailResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {
    }

    @Query( () => MediaContentDetailType)
    public getMediaContent(
        @Args({name: 'slug', type: () => String!}) slug: string,
    ) {
        return this._cmsService.getMediaDetailBySlug(slug)
    }
    @ResolveField('isSeries')
    public isSeries(
        @Parent() parent: MediaContentDetailType,
    ) {

        return this._cmsService.isSeries(parent.tags)
    }
    @ResolveField('totalSeason')
    public totalSeason(
        @Parent() parent: MediaContentDetailType,
    ) {
        return this._cmsService.totalSeason(parent)
    }

    @ResolveField('totalEpisode')
    public totalEpisode(
        @Parent() parent: MediaContentDetailType,
    ) {
        return this._cmsService.totalEpisode(parent)
    }

    @ResolveField('captions')
    public captions(
        @Parent() parent: MediaContentDetailType
    ){
        return parent.seasons.flatMap( s=> s.mediaEpisodes.flatMap( ep => ep.captions))
    }

    @ResolveField('audios')
    public audios(
        @Parent() parent: MediaContentDetailType
    ){
        return parent.seasons.flatMap( s=> s.mediaEpisodes.flatMap( ep => ep.audio))
    }
}
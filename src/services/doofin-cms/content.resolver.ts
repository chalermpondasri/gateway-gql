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
        @Args({name: 'id'}) id: string,
        @Args({name: 'profileId'}) profileId: string,
    ) {
        return this._cmsService.getMediaContentById(id, profileId)
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

    @Query(()=> [MediaContentDetailType])
    public searchContentByKeyword(
        @Args('profileId') profileId: string,
        @Args({name: 'keyword', nullable: true}) keyword: string, 
    ){
        return this._cmsService.searchContent(profileId, keyword)
    }

    @Query(()=> [MediaContentDetailType])
    public searchContentByTags(
        @Args('profileId') profileId: string,
        @Args({name: 'tags', type: ()=> [String]}) tags: string[],
    ){
        return this._cmsService.searchContent(profileId, null, tags)
    }
}
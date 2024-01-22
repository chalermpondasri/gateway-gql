import {
    Args,
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import {
    MediaContentDetailType,
    MediaEpisodeType,
} from '@/types/objects'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { IAuthRepository } from '@/repositories/auth'
import { map } from 'rxjs'
import { SearchInput } from '@/types/inputs/search.input'
import { SearchService } from '../search/services/search.service'
@Resolver(() => MediaContentDetailType)
export class MediaContentDetailResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
        @Inject(SearchService)
        private readonly _searchService: SearchService,
    ) {
    }

    @Query( () => MediaContentDetailType)
    public getMediaContent(
        @Args({name: 'id'}) id: string,
        @Args({name: 'profileId', nullable: true}) profileId: string,
        @Context() context: any
    ) {
        context.req.profileId = profileId
        return this._cmsService.getMediaContentById(id)
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
        if(!!parent.totalSeason) return parent.totalSeason
        return this._cmsService.getTotalSeason(parent)
    }

    @ResolveField('totalEpisode')
    public totalEpisode(
        @Parent() parent: MediaContentDetailType,
    ) {
        if(!!parent.totalEpisode) return parent.totalEpisode
        return this._cmsService.getCaptionAudioOrTotalEp(parent, 'totalEp')
    }

    @ResolveField('captions')
    public captions(
        @Parent() parent: MediaContentDetailType
    ){
        if(!!parent.captions) return parent.captions
        return this._cmsService.getCaptionAudioOrTotalEp(parent, 'caption')
    }

    @ResolveField('audios')
    public audios(
        @Parent() parent: MediaContentDetailType
    ){
        if(!!parent.audios) return parent.audios
        return this._cmsService.getCaptionAudioOrTotalEp(parent, 'audio')
    }

    @Query(()=> [MediaContentDetailType])
    public searchContentByKeyword(@Args(SearchInput.name) input: SearchInput){
        return this._searchService.searchContentByKeyword(input)
    }

    @Query(()=> [MediaContentDetailType])
    public searchContentByTags(
        @Args('profileId') profileId: string,
        @Args({name: 'tags', type: ()=> [String]}) tags: string[],
    ){
        return this._cmsService.searchContentByTag(profileId,tags)
    }

    @ResolveField()
    public seasons(@Parent() parent:MediaContentDetailType) {
        return this._cmsService.getSeason(parent)
    }

}

@Resolver(() => MediaEpisodeType)
export class MediaEpisodeResolver {
    public constructor(
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
    ){}
    @ResolveField("continueWatchingAt", ()=> Number)
    public continueWatchingAt(@Parent() parent: MediaEpisodeType, @Context() context: any){
         return this._authRepository.getContinueWatching(context.req.profileId, parent.mediaContentId.toString()).pipe(
            map(watchingDetail=>{
                return watchingDetail[parent.id.toString()] ?? 0
            })
         )
    }
}
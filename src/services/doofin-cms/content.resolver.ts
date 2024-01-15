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
    public searchContentByTags(
        @Args('profileId') profileId: string,
        @Args({name: 'tags', type: ()=> [String]}) tags: string[],
    ){
        return this._cmsService.searchContent(profileId, tags)
    }

    @ResolveField()
    public seasons(@Parent() parent:MediaContentDetailType) {
        const newSeason = parent.seasons.map(s=>{
            return s.mediaEpisodes.map((e) => {
                e.mediaContentId = parent.id;
                return e;
            });
        })
        return newSeason
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
        console.log(context.req.profileId);
        
         return this._authRepository.getContinueWatching(context.req.profileId, parent.mediaContentId.toString()).pipe(
            map(watchingDetail=>{
                return watchingDetail[parent.id.toString()] ?? 0
            })
         )
    }
}
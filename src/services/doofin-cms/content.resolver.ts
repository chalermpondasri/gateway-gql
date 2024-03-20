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
import { SearchInput } from '@/types/inputs/search.input'
import { SearchService } from '../search/services/search.service'
import { RentalStatus } from '@/types/enums/rental-status.enum'
import { PaymentService } from '@/services/payment/payment.service'
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

    @ResolveField('totalDuration')
    public totalDuration(
        @Parent() parent: MediaContentDetailType,
    ) {
        return this._cmsService.getTotalDuration(parent)
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
        @Args({name: 'profileId', nullable: true}) profileId: string,
        @Args({name: 'tags', type: ()=> [String]}) tags: string[],
    ){
        return this._cmsService.searchContentByTag(profileId,tags)
    }

    @ResolveField()
    public seasons(@Parent() parent:MediaContentDetailType) {
        if(!!parent.seasons) return parent.seasons
        return this._cmsService.getSeason(parent)
    }

}

@Resolver(() => MediaEpisodeType)
export class MediaEpisodeResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
        @Inject(PaymentService)
        private readonly _paymentService: PaymentService
    ){}
    @ResolveField("continueWatchingAt", ()=> Number)
    public continueWatchingAt(@Parent() parent: MediaEpisodeType, @Context() context: any){
         return this._cmsService.getContinueWatching(
            context.req.profileId, 
            parent.mediaContentId.toString(), 
            parent.id.toString()
        )
    }

    @ResolveField('rentalStatus', () => RentalStatus)
    public rentalStatus(@Parent() parent: MediaEpisodeType) {
        return this._paymentService.getRentalStatus(parent)
    }
}
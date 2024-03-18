import {
    Args,
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import {
    Inject,
    Logger,
    LoggerService,
} from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import {
    SectionItemType,
    SectionType,
} from '@/types/objects'
import { ProviderName } from '@/constants/provider-name.const'
import { CacheService } from '@/services/cache/cache.service'

@Resolver(() => SectionType)
export class SectionResolver {
    private readonly _logger: LoggerService

    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: CacheService,
    ) {
        this._logger = new Logger(SectionResolver.name)
    }

    @Query(() => [SectionType])
    public getMainPage(
        @Args({ name: 'profileId', nullable: true }) profileId: string,
        @Args({name: 'sectionId', nullable: true}) sectionId: number,
        @Context() context: any,

        ) {
        context.req.profileId = profileId

        return this._cmsService.getMainPageSections(sectionId)

    }

    @Query(() => [SectionItemType])
    public getKidFin(@Args({ name: 'profileId', nullable: true }) profileId: string, @Context() context: any) {
        context.req.profileId = profileId
        return this._cmsService.getKidFin()
    }

    @Query(() => [SectionItemType])
    public getNewFin() {
        return this._cmsService.getNewFin()
    }
}

@Resolver(() => SectionItemType)
export class SectionItemResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }

    @ResolveField('recentlyPublished', () => Boolean)
    public recentlyPublished(
        @Parent() parent: SectionItemType,
    ) {
        return false
    }

    @ResolveField('totalDuration')
    public totalDuration(
        @Parent() parent: SectionItemType,
    ) {
        return this._cmsService.getTotalDuration(parent.mediaContentDetail)
    }
}
import {
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
    MediaContentDetailType,
    SectionItemType,
    SectionType,
} from '@/types/objects'
import {
    from,
    mergeMap,
    of,
    tap,
} from 'rxjs'
import {
    isEmpty,
    isNil,
} from 'lodash'
import { ProviderName } from '@/constants/provider-name.const'
import { CacheService } from '@/services/cache/cache.service'
import { CacheName } from '@/services/cache/interface/service.interface'

@Resolver(() => SectionType)
export class SectionResolver {
    private readonly _logger: LoggerService

    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: CacheService
    ) {
        this._logger = new Logger(SectionResolver.name)
    }

    @Query(() => [SectionType])
    public getMainPage() {
        return this._cacheService.getCache(CacheName.MAIN_PAGE).pipe(
            mergeMap(resultCache => {
                if(isNil(resultCache)) {
                    return this._cmsService.getMainPageSections().pipe(
                        tap(resp => {
                            if(!isEmpty(resp)) {
                                this._logger.debug(`NEW CACHE`)
                                this._cacheService.setCache(CacheName.MAIN_PAGE, JSON.stringify(resp))
                            }
                        })
                    )
                }
                this._logger.debug(`CACHE DATA`)
                return of(JSON.parse(resultCache as string))
            })
        )

    }

    @Query(() => [MediaContentDetailType])
    public getKidFin() {
        return this._cmsService.getKidFin()
    }
}

@Resolver(() => SectionItemType)
export class SectionItemResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {
    }
    @ResolveField('recentlyPublished', () => Boolean)
    public recentlyPublished(
        @Parent() parent: SectionItemType
    ) {
        return false
    }
}
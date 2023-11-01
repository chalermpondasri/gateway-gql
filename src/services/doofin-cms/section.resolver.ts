import {
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import {
    SectionItemType,
    SectionType,
} from '@/types/objects'

@Resolver(() => SectionType)
export class SectionResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {
    }

    @Query(() => [SectionType])
    public getMainPage() {
        return this._cmsService.getMainPageSections()
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
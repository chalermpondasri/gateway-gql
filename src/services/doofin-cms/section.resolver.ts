import {
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { SectionType } from '@/types/objects'

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
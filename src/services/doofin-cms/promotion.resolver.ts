import {
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { CmsPromotionalContentType } from '@/types/objects/cms.type'

@Resolver()
export class PromotionResolver {
    constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }

    @Query(() => [CmsPromotionalContentType])
    public getPromotionalContents() {
        return this._cmsService.getPromotionalContent()
    }

}
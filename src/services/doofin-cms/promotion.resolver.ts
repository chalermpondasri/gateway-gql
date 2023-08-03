import {
    Context,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { CmsPromotionalContentType } from '@/types/objects/cms.type'
import { parse } from 'accept-language-parser'

@Resolver()
export class PromotionResolver {
    constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }

    @Query(() => [CmsPromotionalContentType])
    public getPromotionalContents(
        @Context() ctx,
    ) {

        const lang  = parse(ctx.req.headers['accept-language'])
        return this._cmsService.getPromotionalContent(lang[0]?.code ?? 'en')
    }

}
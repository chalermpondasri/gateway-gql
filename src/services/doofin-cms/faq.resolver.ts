import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import {
    Context,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { SubjectType } from '@/types/objects/subject.type'
import { parse } from 'accept-language-parser'

@Resolver()
export class FaqResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }
    @Query(() => [SubjectType])
    public getFAQs(
        @Context() ctx,
    ) {
        const lang  = parse(ctx.req.headers['accept-language'])
        return this._cmsService.getFaqs(lang[0]?.code)
    }
}
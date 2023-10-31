import { Module } from '@nestjs/common'
import { TermResolver } from '@/services/doofin-cms/term.resolver'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { cmsRepositoryProvider } from '@/providers/cms.provider'
import { LocaleResolver } from '@/services/doofin-cms/locale.resolver'
import { PromotionResolver } from '@/services/doofin-cms/promotion.resolver'
import { FaqResolver } from '@/services/doofin-cms/faq.resolver'
import { SectionResolver } from '@/services/doofin-cms/section.resolver'

@Module({
    providers: [
        cmsRepositoryProvider,
        TermResolver,
        CmsService,
        LocaleResolver,
        PromotionResolver,
        FaqResolver,
        SectionResolver,
    ],
    exports: [ CmsService ]
})
export class CmsModule {}
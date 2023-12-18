import { Module } from '@nestjs/common'
import { TermResolver } from '@/services/doofin-cms/term.resolver'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { cmsRepositoryProvider } from '@/providers/cms.provider'
import { LocaleResolver } from '@/services/doofin-cms/locale.resolver'
import { PromotionResolver } from '@/services/doofin-cms/promotion.resolver'
import { FaqResolver } from '@/services/doofin-cms/faq.resolver'
import {
    SectionItemResolver,
    SectionResolver,
} from '@/services/doofin-cms/section.resolver'
import { MediaContentDetailResolver } from '@/services/doofin-cms/content.resolver'
import { authRepositoryProvider } from '@/providers/auth.provider'

@Module({
    providers: [
        cmsRepositoryProvider,
        TermResolver,
        CmsService,
        LocaleResolver,
        PromotionResolver,
        FaqResolver,
        SectionResolver,
        SectionItemResolver,
        MediaContentDetailResolver,
        authRepositoryProvider,
    ],
    exports: [ CmsService ]
})
export class CmsModule {}
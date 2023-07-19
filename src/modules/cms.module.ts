import { Module } from '@nestjs/common'
import { TermResolver } from '@/services/doofin-cms/term.resolver'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { cmsRepositoryProvider } from '@/providers/cms.provider'
import { LocaleResolver } from '@/services/doofin-cms/locale.resolver'

@Module({
    providers: [
        cmsRepositoryProvider,
        TermResolver,
        CmsService,
        LocaleResolver,
    ]
})
export class CmsModule {}
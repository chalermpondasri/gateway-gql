import { Module } from '@nestjs/common'
import { CmsResolver } from '@/services/doofin-cms/cms.resolver'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { cmsRepositoryProvider } from '@/providers/cms.provider'

@Module({
    providers: [
        cmsRepositoryProvider,
        CmsResolver,
        CmsService,
    ]
})
export class CmsModule {}
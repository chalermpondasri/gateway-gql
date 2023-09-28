import { Module } from '@nestjs/common'
import {
    AuthResolver,
    AuthService,
    CategoryResolver,
    ResourceResolver,
    LocaleService,
    ProfileResolver,
    UserResolver,
} from '@/services/doofin-auth'
import {
    authRepositoryProvider,
    localeRepositoryProvider,
} from '@/providers/auth.provider'
import { LocaleResolver } from '@/services/doofin-auth/locale.resolver'
import { CmsModule } from './cms.module'

@Module({
    providers: [
        authRepositoryProvider,
        localeRepositoryProvider,
        AuthResolver,
        AuthService,
        CategoryResolver,
        LocaleResolver,
        LocaleService,
        ProfileResolver,
        UserResolver,
        ResourceResolver,
    ],
    imports: [ CmsModule ],
})
export class AuthModule {}
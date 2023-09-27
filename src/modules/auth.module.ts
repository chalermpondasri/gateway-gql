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
})
export class AuthModule {}
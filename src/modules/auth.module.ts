import { Module } from '@nestjs/common'
import {
    AuthResolver,
    AuthService,
    CategoryResolver,
    ResourceResolver,
    LocaleService,
    ProfileResolver,
    UserResolver,
    DeviceSessionResolver,
    NotificationResolver,
    MyListResolver,
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
        DeviceSessionResolver,
        NotificationResolver,
        MyListResolver
    ],
    imports: [ CmsModule ],
})
export class AuthModule {}
import { Module } from '@nestjs/common'
import {
    AuthResolver,
    AuthService,
    CategoryResolver,
    DeviceSessionResolver,
    LocaleService,
    MyListResolver,
    NotificationResolver,
    ProfileResolver,
    ResourceResolver,
    UserResolver,
} from '@/services/doofin-auth'
import {
    authRepositoryProvider,
    localeRepositoryProvider,
} from '@/providers/auth.provider'
import { LocaleResolver } from '@/services/doofin-auth/locale.resolver'
import { CmsModule } from './cms.module'
import { PlaybackModule } from '@/modules/playback.module'

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
    imports: [ CmsModule, PlaybackModule ],
})
export class AuthModule {}
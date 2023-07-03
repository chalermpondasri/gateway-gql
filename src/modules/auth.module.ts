import { Module } from '@nestjs/common'
import { AuthResolver } from '@/services/doofin-auth/auth.resolver'
import { authRepositoryProvider } from '@/providers/auth.provider'
import { AuthService } from '@/services/doofin-auth/auth.service'

@Module({
    providers: [
        AuthResolver,
        authRepositoryProvider,
        AuthService,
    ],
})
export class AuthModule {}
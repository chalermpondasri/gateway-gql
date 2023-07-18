import { Module } from '@nestjs/common'
import {
    AuthResolver,
    AuthService,
    CategoryResolver,
} from '@/services/doofin-auth'
import { authRepositoryProvider } from '@/providers/auth.provider'

@Module({
    providers: [
        AuthResolver,
        authRepositoryProvider,
        AuthService,
        CategoryResolver,
    ],
})
export class AuthModule {}
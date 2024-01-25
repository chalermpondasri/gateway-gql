import { Module } from '@nestjs/common'
import { KmsByteArkController } from '@/services/kms-byteark/kms-byteark.controller'
import { kmsByteArkProvider } from '@/providers/kms-byteark-provider'
import { authRepositoryProvider } from '@/providers/auth.provider'

@Module({
    providers: [
        authRepositoryProvider,
        kmsByteArkProvider
    ],
    controllers: [KmsByteArkController]
})
export class KmsModule {}
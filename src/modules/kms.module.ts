import { Module } from '@nestjs/common'
import { KmsByteArkController } from '@/services/kms-byteark/kms-byteark.controller'
import { kmsByteArkProvider } from '@/providers/kms-byteark-provider'
import { authRepositoryProvider } from '@/providers/auth.provider'
import { BytearkPlayerResolver } from '@/services/kms-byteark/byteark-player.resolver'

@Module({
    providers: [
        authRepositoryProvider,
        kmsByteArkProvider,
        BytearkPlayerResolver
    ],
    controllers: [KmsByteArkController],
    exports: [
        kmsByteArkProvider
    ]
})
export class KmsModule {}
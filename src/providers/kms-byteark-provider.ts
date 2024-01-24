import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { KmsByteArkService } from '@/services/kms-byteark/kms-byteark.service'
import { IAuthRepository } from '@/repositories/auth'

export const kmsByteArkProvider: Provider = {
    provide: ProviderName.KMS_BYTE_ARK_PROVIDER,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.AUTH_REPOSITORY
    ],
    useFactory: (
        config: EnvironmentConfig,
        authRepo: IAuthRepository,
    ) => new KmsByteArkService(config, authRepo),
}
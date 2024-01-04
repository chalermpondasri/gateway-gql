import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { ByteArkRepository } from '@/repositories/byte-ark/byte-ark.repository'
import { Provider } from '@nestjs/common'
import { S3 } from '@aws-sdk/client-s3';

export const byteArkRepositoryProvider: Provider = {
    provide: ProviderName.BYTE_ARK_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
    ],
    useFactory: async (config: EnvironmentConfig) => {
        const s3 = new S3({
            credentials: {
                accessKeyId: config.BYTE_ARK_AK,
                secretAccessKey: config.BYTE_ARK_SK,
            },
            endpoint: config.BYTE_ARK_END_POINT, 
            forcePathStyle: true,
            region:config.BYTE_ARK_REGION

        });      
        return new ByteArkRepository(s3, config)
    },
}
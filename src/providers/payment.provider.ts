import {
    Provider,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { PaymentRepository } from '@/repositories/payment/payment.repository'
import { EnvironmentConfig } from '@/models/common'
import { AxiosInstance } from 'axios'

export const paymentRepositoryProvider: Provider = {
    provide: ProviderName.PAYMENT_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: (config: EnvironmentConfig,
                 client: AxiosInstance,
    ) => {
        client.defaults.baseURL = config.PAYMENT_ENDPOINT
        return new PaymentRepository(client)
    },
}
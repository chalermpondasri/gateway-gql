import {
    InternalServerErrorException,
    Provider,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { EnvironmentConfig } from '@/models/common'
import { ProviderName } from '@/constants/provider-name.const'

export const envConfigProvider: Provider<EnvironmentConfig> = {
    provide: ProviderName.ENV_CONFIG,
    useFactory: async () => {
        const env = plainToInstance(EnvironmentConfig, process.env)
        const errors = validateSync(env)
        if (errors.length !== 0) {
            throw new InternalServerErrorException(errors.join(','))
        }
        return env
    },
}
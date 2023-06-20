import {
    InternalServerErrorException,
    Provider
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { EnvironmentConfig } from '@/models/common'
import { ProviderNames } from '@/constants/provider-name.const'
import { config } from 'dotenv'

export const envConfigProvider: Provider<EnvironmentConfig> = {
    provide: ProviderNames.ENV_CONFIG,
    useFactory: () => {
        config({
            path: `.env.${process.env.NODE_ENV}`
        })
        const env = plainToInstance(EnvironmentConfig, process.env)
        const errors = validateSync(env)
        if (errors.length !== 0) {
            throw new InternalServerErrorException(errors.join(','))
        }
        return env
    },
}
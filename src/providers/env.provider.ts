import {
    InternalServerErrorException,
    Logger,
    Provider,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { EnvironmentConfig } from '@/models/common'
import { ProviderName } from '@/constants/provider-name.const'
import { config } from 'dotenv'
import InfisicalClient from 'infisical-node'
import { reduce } from 'lodash'

export const envConfigProvider: Provider<EnvironmentConfig> = {
    provide: ProviderName.ENV_CONFIG,
    useFactory: async () => {
        config()
        const logger = new Logger('EnvConfig')
        const client = new InfisicalClient({
            token: process.env.INFISICAL_TOKEN,
            siteURL: process.env.INFISICAL_URL,
        })
        const secretEnv = await client.getAllSecrets({
            environment: process.env.INFISICAL_ENV || 'dev',
            path: '/',
            attachToProcessEnv: false,
            includeImports: false
        })
        let env
        let checkEnvFalse = true
        if (secretEnv.length === 1) {
            checkEnvFalse = !secretEnv[0].isFallback
            logger.debug('Infisical Load Fail')
        }
        if (checkEnvFalse) {
            logger.debug('Infisical Load Success')
            const mapToEnv = reduce(secretEnv, (acc, value) => {
                Object.assign(acc, {
                    [value.secretName]: value.secretValue,
                })
                return acc
            }, {})
            // for env override
            env = plainToInstance(EnvironmentConfig, {
                ...mapToEnv,
                ...process.env,
            })
            console.log('ENV', mapToEnv)
        } else {
            env = plainToInstance(EnvironmentConfig, process.env)
        }

        const errors = validateSync(env)
        if (errors.length !== 0) {
            throw new InternalServerErrorException(errors.join(','))
        }
        return env
    },
}
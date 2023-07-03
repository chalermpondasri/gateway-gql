import {
    IsNotEmpty
} from 'class-validator'

export class EnvironmentConfig {
    @IsNotEmpty()
    declare readonly NODE_ENV: string

    @IsNotEmpty()
    declare readonly CMS_ENDPOINT: string

    @IsNotEmpty()
    declare readonly CMS_API_KEY

    @IsNotEmpty()
    declare readonly AUTH_ENDPOINT: string
}
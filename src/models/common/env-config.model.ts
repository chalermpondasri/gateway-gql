import {
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsString,
} from 'class-validator'

export class EnvironmentConfig {
    @IsNotEmpty()
    public declare readonly NODE_ENV: string

    @IsNotEmpty()
    public declare readonly CMS_ENDPOINT: string

    @IsNotEmpty()
    public declare readonly CMS_API_KEY

    @IsNotEmpty()
    public declare readonly AUTH_ENDPOINT: string

    @IsNotEmpty()
    public declare readonly LOCALE_ENDPOINT: string

    @IsNotEmpty()
    public declare readonly INFISICAL_TOKEN: string

    @IsNotEmpty()
    public declare readonly INFISICAL_URL: string

    @IsNotEmpty()
    public declare readonly REDIS_HOST: string

    @IsNumberString()
    public declare readonly REDIS_PORT: string

    @IsString()
    public declare readonly REDIS_USER: string

    @IsString()
    public declare readonly REDIS_PASS: string
}
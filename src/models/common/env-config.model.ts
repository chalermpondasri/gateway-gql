import {
    IsNotEmpty
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
}
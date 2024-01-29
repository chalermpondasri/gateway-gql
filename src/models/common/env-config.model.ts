import {
    IsNotEmpty,
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
    public declare readonly SEARCH_ENDPOINT: string

    @IsNotEmpty()
    public declare readonly LOCALE_ENDPOINT: string

    @IsNotEmpty()
    public declare readonly REDIS_HOST: string

    @IsNumberString()
    public declare readonly REDIS_PORT: string

    @IsString()
    public declare readonly REDIS_USER: string

    @IsString()
    public declare readonly REDIS_PASS: string

    @IsString()
    public declare readonly BYTE_ARK_AK: string

    @IsString()
    public declare readonly BYTE_ARK_SK: string

    @IsString()
    public declare readonly BYTE_ARK_END_POINT: string

    @IsString()
    public declare readonly BYTE_ARK_REGION: string

    @IsString()
    public declare readonly IMAGE_BUCKET_NAME: string

    @IsString()
    public declare readonly BYTE_ARK_VIDEO_SECRET_ENCODE: string

    @IsString()
    public declare readonly BYTE_ARK_VIDEO_SECRET_JWT: string

    @IsString()
    public declare readonly SECRET_ENCRYPT_KEY_VIDEO: string

    @IsString()
    public declare readonly BYTE_ARK_SIGN_URL_ACCESS: string

    @IsString()
    public declare readonly BYTE_ARK_SIGN_URL_SECRET: string

    @IsString()
    public declare readonly BYTE_ARK_SIGN_URL_DOMAIN: string

}
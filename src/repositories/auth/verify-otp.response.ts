import { BaseUserResponse } from '@/repositories/auth/create-user.response'
import { Type } from 'class-transformer'

class JwtTokenResponse {
    public accessToken: string
    public refreshToken: string
}
export class VerifyOtpResponse extends BaseUserResponse {
    @Type(()=> JwtTokenResponse)
    public tokens: JwtTokenResponse
}
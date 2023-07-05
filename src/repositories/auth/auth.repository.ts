import {
    CreateUserRequest,
    CreateUserResponse,
    IAuthRepository,
    SendOtpRequest,
    SendOtpResponse
} from '@/repositories/auth'
import {
    from,
    map,
    Observable
} from 'rxjs'
import { EnvironmentConfig } from '@/models/common'
import axios, {
    AxiosInstance,
    AxiosResponse
} from 'axios'
import { BadRequestException } from '@nestjs/common'

export class AuthRepository implements IAuthRepository {
    private readonly _axiosInstance: AxiosInstance

    constructor(config: EnvironmentConfig) {
        this._axiosInstance = axios.create({
            baseURL: `${config.AUTH_ENDPOINT}`,
        })
        this._axiosInstance.interceptors.response.use(null, error => {
            throw new BadRequestException(error.response.data)
        })
    }
    public createNewUser(request: CreateUserRequest): Observable<CreateUserResponse> {
        return from(this._axiosInstance.post<CreateUserResponse>(`/user`, request)).pipe(
            map((result: AxiosResponse<CreateUserResponse>) => {
                return result.data
            })
        )
    }

    public requestOtp(request: SendOtpRequest): Observable<SendOtpResponse> {
        return from(this._axiosInstance.post('/otp/send', request)).pipe(
            map( (result: AxiosResponse<SendOtpResponse>) => {
                const data = new SendOtpResponse()
                data.remaining = result.data.remaining
                data.referenceNumber = result.data.referenceNumber
                data.expiredAt = new Date(result.data.expiredAt)
                return data
            }),

        )
    }

}
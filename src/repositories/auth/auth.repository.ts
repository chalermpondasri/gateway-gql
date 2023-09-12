import {
    BaseProfileRespose,
    CategoryResponse,
    CreateUserRequest,
    CreateUserResponse,
    IAuthRepository,
    ListResponse,
    OtpChangePhoneResponse,
    ProfileRespose,
    SendOtpRequest,
    SendOtpResponse,
    UserResponse,
    UserVerifyEmailRequest,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '@/repositories/auth'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { EnvironmentConfig } from '@/models/common'
import axios, {
    AxiosInstance,
    AxiosResponse,
} from 'axios'
import { BadRequestException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import * as http from 'http'
import { 
    CreateProfilePinInput,
    UpdateProfilePinInput, 
} from '@/types/inputs'

export class AuthRepository implements IAuthRepository{
    private readonly _axiosInstance: AxiosInstance

    constructor(config: EnvironmentConfig) {
        const agent = new http.Agent({family: 4})
        this._axiosInstance = axios.create({
            baseURL: `${config.AUTH_ENDPOINT}`,
            httpAgent: agent,
        })
        this._axiosInstance.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
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

    public verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse> {
        return from(this._axiosInstance.post('/otp/verify', request)).pipe(
            map( (result: AxiosResponse<VerifyOtpResponse>) => {
                const data = new VerifyOtpResponse()
                data.userId = result.data.userId
                data.status = result.data.status
                return data
            }),
        )
    }

    public updateUserPreferences(userId: string, preferences: string[]): Observable<string[]> {
        return from(this._axiosInstance.patch(`/user/${userId}/categories`, preferences)).pipe(
            map((result: AxiosResponse<string[]>) => {
                return result.data
            })
        )
    }

    public getCategories(): Observable<ListResponse<CategoryResponse>> {
        return from(this._axiosInstance.get(`/categories`)).pipe(
            map( ({data}) => {
                return plainToInstance(ListResponse<CategoryResponse>, data)
            })
        )
    }

    public login(identity: string, password: string): Observable<{ accessToken: string; refreshToken: string }> {
        return from(this._axiosInstance.post(`/auth/login`, {identity, password})).pipe(
            map(({data}) => {
                return data
            })
        )
    }

    public verifyEmail(request: UserVerifyEmailRequest): Observable<UserResponse> {
        return from(this._axiosInstance.patch(`/user/verify/email`,request)).pipe(
            map(({data}) => {
                return data
            })
        )
    }

    public getProfiles(token: string): Observable<ListResponse<BaseProfileRespose>> {
        return from(this._axiosInstance.get<ListResponse<BaseProfileRespose>>('user/me/profiles',{headers: {Authorization: 'Bearer ' + token}})).pipe(
            map(res=> res.data)
        )
    }

    public createProfilePin(token: string, arg: CreateProfilePinInput): Observable<ProfileRespose>{
        return from(
          this._axiosInstance.post<ProfileRespose>(
            `user/me/profile/${arg.profileId}/pin`,
            { newPin: arg.newPin },
            { headers: { Authorization: 'Bearer ' + token } }
          )
        ).pipe(map((res) => res.data));
    }

    public changeProfilePin(token: string, arg: UpdateProfilePinInput): Observable<ProfileRespose>{
        const {newPin, oldPin} = arg
        return from(
          this._axiosInstance.patch<ProfileRespose>(
            `user/me/profile/${arg.profileId}/pin`,
            { newPin, oldPin  },
            { headers: { Authorization: 'Bearer ' + token } }
          )
        ).pipe(map((res) => res.data));
    }

    public requestToChangePhoneNumber(token: string, phoneNumber: string): Observable<OtpChangePhoneResponse> {
        return from(
          this._axiosInstance.post(
            '/user/me/request/phone-number',
            { phoneNumber },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        ).pipe(map((res) => plainToInstance(OtpChangePhoneResponse, res.data)));
    }

}
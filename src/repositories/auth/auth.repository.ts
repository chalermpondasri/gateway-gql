import {
    BaseProfileResponse,
    CategoryResponse,
    CreateUserRequest,
    CreateUserResponse,
    IAuthRepository,
    ListResponse,
    OtpChangePhoneResponse,
    OtpVerifyPhoneResponse,
    ProfileHasAccountInformationResponse,
    ProfileResponse,
    SendOtpRequest,
    SendOtpResponse,
    UserResponse,
    UserVerifyEmailRequest,
    VerifyEmailUserResponse,
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
    UserChangePasswordInput,
    UserVerifyOtpInput,
} from '@/types/inputs'
import { RequestContext } from '@/providers/request-context.provider'

export class AuthRepository implements IAuthRepository {
    private readonly _axiosInstance: AxiosInstance

    public constructor(
        config: EnvironmentConfig,
        private readonly _context: RequestContext,
    ) {
        const agent = new http.Agent({family: 4})
        this._axiosInstance = axios.create({
            baseURL: `${config.AUTH_ENDPOINT}`,
            httpAgent: agent,
            withCredentials: true,
        })
        this._axiosInstance.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
        })
    }
    public createNewUser(request: CreateUserRequest): Observable<CreateUserResponse> {
        return from(this._axiosInstance.post<CreateUserResponse>(`/user`, request)).pipe(
            map((result: AxiosResponse<CreateUserResponse>) => {
                return result.data
            }),
        )
    }

    public requestOtp(request: SendOtpRequest): Observable<SendOtpResponse> {
        return from(this._axiosInstance.post('/otp/send', request)).pipe(
            map((result: AxiosResponse<SendOtpResponse>) => {
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
            map((result: AxiosResponse<VerifyOtpResponse>) => {
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
            }),
        )
    }

    public getCategories(): Observable<ListResponse<CategoryResponse>> {
        return from(this._axiosInstance.get(`/categories`)).pipe(
            map(({data}) => {
                return plainToInstance(ListResponse<CategoryResponse>, data)
            }),
        )
    }

    public login(identity: string, password: string): Observable<{ accessToken: string; refreshToken: string }> {
        return from(this._axiosInstance.post(
            `/auth/login`,
            {identity, password},
        )).pipe(
            map(({data}) => {
                return data
            }),
        )
    }

    public verifyEmail(request: UserVerifyEmailRequest): Observable<VerifyEmailUserResponse> {
        return from(this._axiosInstance.patch(`/user/verify/email`, request)).pipe(
            map(({data}) => {
                return data
            }),
        )
    }

    public getProfiles(token: string): Observable<ListResponse<BaseProfileResponse>> {
        return from(this._axiosInstance.get<ListResponse<BaseProfileResponse>>('user/me/profiles', {headers: {Authorization: 'Bearer ' + token}})).pipe(
            map(res => res.data),
        )
    }

    public createProfilePin(token: string, arg: CreateProfilePinInput): Observable<ProfileResponse> {
        return from(
            this._axiosInstance.post<ProfileResponse>(
                `user/me/profile/${arg.profileId}/pin`,
                {newPin: arg.newPin},
                {headers: {Authorization: 'Bearer ' + token}},
            ),
        ).pipe(map((res) => res.data))
    }

    public changeProfilePin(token: string, arg: UpdateProfilePinInput): Observable<ProfileResponse> {
        const {newPin, oldPin} = arg
        return from(
            this._axiosInstance.patch<ProfileResponse>(
                `user/me/profile/${arg.profileId}/pin`,
                {newPin, oldPin},
                {headers: {Authorization: 'Bearer ' + token}},
            ),
        ).pipe(map((res) => res.data))
    }

    public refreshToken(token: string): Observable<{ accessToken: string; refreshToken: string }> {
        return from(this._axiosInstance.get('/auth/token/refresh', {headers: {Authorization: `Bearer ${token}`}})).pipe(
            map(({data}) => {
                return data
            }),
        )
    }

    public requestToChangePhoneNumber(token: string, phoneNumber: string): Observable<OtpChangePhoneResponse> {
        return from(
            this._axiosInstance.post(
                '/user/me/request/phone-number',
                {phoneNumber},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            ),
        ).pipe(map((res) => plainToInstance(OtpChangePhoneResponse, res.data)))
    }

    public verifyToChangePhoneNumber(token: string, input: UserVerifyOtpInput): Observable<OtpVerifyPhoneResponse> {
        return from(
            this._axiosInstance.patch('/user/me/verify/phone-number', input, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ).pipe(map((res) => plainToInstance(OtpVerifyPhoneResponse, res.data)))
    }

    public changePassword(token: string, input: UserChangePasswordInput): Observable<OtpVerifyPhoneResponse> {
        return from(
            this._axiosInstance.patch('/user/me/password', input, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ).pipe(map((res) => plainToInstance(OtpVerifyPhoneResponse, res.data)))
    }

    public getProfileAndAccountInformation(token: string, profileId: string): Observable<ProfileHasAccountInformationResponse> {
        return from(
            this._axiosInstance.get(`/user/me/profile/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ).pipe(
            map(res => plainToInstance(ProfileHasAccountInformationResponse, res.data)),
        )
    }

    public getCurrentUser(token: string): Observable<UserResponse> {
        return from(
            this._axiosInstance.get(`/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        ).pipe(
            map(res=> plainToInstance(UserResponse, res.data))
        )
    }

    public revokeSessions(token: string): Observable<{ ids: string[] }> {
        const promise = this._axiosInstance.delete(`/auth/sessions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return from(promise).pipe(
            map(res => res.data),
        )
    }

    public getContentRating(): Observable<string[]> {
        return from(this._axiosInstance.get<string[]>('/resources/content-rating')).pipe(
            map(res=> res?.data ?? [])
        )
    }

}
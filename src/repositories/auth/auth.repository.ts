import {
    BaseProfileResponse,
    CategoryResponse,
    CreateUserRequest,
    CreateUserResponse,
    DeviceSessionResponse,
    IAuthRepository,
    ListResponse,
    NotificationQueryRequest,
    NotificationResponse,
    OtpChangePhoneResponse,
    OtpVerifyPhoneResponse,
    ProfileRequestResetPinResponse,
    ProfileResponse,
    SendOtpRequest,
    SendOtpResponse,
    UpdateUserDeviceSettingRequest,
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
import {
    AxiosInstance,
    AxiosResponse,
} from 'axios'
import { plainToInstance } from 'class-transformer'
import {
    CreateProfileInput,
    CreateProfilePinInput,
    UpdateProfilePinInput,
    UserChangePasswordInput,
    UserVerifyOtpInput,
    VerifyResetProfilePin,
} from '@/types/inputs'
import { omit } from 'lodash'

export class AuthRepository implements IAuthRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance
    ) {}
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

    public getProfileById(token: string, profileId: string): Observable<ProfileResponse> {
        return from(
            this._axiosInstance.get(`/user/me/profile/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ).pipe(
            map(res => plainToInstance(ProfileResponse, res.data)),
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

    public listUserSessions(): Observable<DeviceSessionResponse[]> {
        const promise = this._axiosInstance.get(`/user/me/sessions`)
        return from(promise).pipe(
            map( res => {
                return plainToInstance(DeviceSessionResponse,<Array<object>>res.data)
            })
        )
    }

    public revokeSingleSession(sessionId: string): Observable<DeviceSessionResponse> {
        const promise = this._axiosInstance.delete(`/user/me/session/${sessionId}`)
        return from(promise).pipe(
            map( res => plainToInstance(DeviceSessionResponse,res.data))
        )
    }

    public flushSessions(): Observable<{ ids: string[] }> {
        const promise = this._axiosInstance.delete(`/user/me/sessions`)

        return from(promise).pipe(
            map(res => res.data),
        )
    }

    public getContentRating(): Observable<string[]> {
        return from(this._axiosInstance.get<string[]>('/resources/content-rating')).pipe(
            map(res=> res?.data ?? [])
        )
    }

    public requestToChangeEmail(token: string, newEmail: string): Observable<Omit<OtpChangePhoneResponse, 'remaining'>> {
        return from(
            this._axiosInstance.post(`/user/me/request/email`,
            {email: newEmail},
            {headers: {Authorization: `Bearer ${token}`}},
            )
        ).pipe(
            map(res => plainToInstance(OtpChangePhoneResponse, res.data))
        )
    }

    public verifyToChangeEmail(token: string, input: UserVerifyOtpInput): Observable<OtpVerifyPhoneResponse> {
        return from(
            this._axiosInstance.patch('/user/me/verify/email', input, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ).pipe(
            map((res) => plainToInstance(OtpVerifyPhoneResponse, res.data))
        )        
    }

    public validateProfilePin(profileId: string, pin: string): Observable<{isValid: boolean}> {       
        return from(
            this._axiosInstance.post<{isValid: boolean}>(
                `/user/me/profile/${profileId}/validate/pin`,
                { pin }
            )
        ).pipe(
            map(({ data }) => ({ isValid: data.isValid}))
        )
    }
    
    public createProfile(body: CreateProfileInput): Observable<ProfileResponse> {
        return from(
            this._axiosInstance.post(`/user/me/profile`, body)
        ).pipe(
            map(res=> plainToInstance(ProfileResponse, res.data))
        )
    }

    public requestTokenToResetPin(profileId: string, password: string): Observable<ProfileRequestResetPinResponse> {
        return from(
            this._axiosInstance.post(`/user/me/profile/${profileId}/request/reset-pin`, { password })
        ).pipe(
            map(res => plainToInstance(ProfileRequestResetPinResponse, res.data))
        )
    }

    public verifyTokenToResetPin(input: VerifyResetProfilePin): Observable<ProfileResponse> {
        return from(
            this._axiosInstance.patch(`/user/me/profile/${input.profileId}/verify/reset-pin`, omit(input,["profileId"]))
        ).pipe(
            map(res => plainToInstance(ProfileResponse, res.data))
        )
    }

    public updateUserSetting(input: UpdateUserDeviceSettingRequest): Observable<UserResponse> {
        return from(
            this._axiosInstance.patch(`/user/me/setting`, input)
        ).pipe(
            map( res => plainToInstance(UserResponse, res.data))
        )
    }
    
    public getNotification(notiQueryRequest: NotificationQueryRequest): Observable<ListResponse<NotificationResponse>> { 
        return from(this._axiosInstance.get('notifications',{params: notiQueryRequest})).pipe(
            map(res => plainToInstance(ListResponse<NotificationResponse>, res.data))
        )
    }

}
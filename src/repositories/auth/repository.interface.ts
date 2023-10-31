import {
    IdResponse,
    CategoryResponse,
    CreateLocaleRequest,
    CreateUserRequest,
    CreateUserResponse,
    ListResponse,
    LocaleResponse,
    SendOtpRequest,
    SendOtpResponse,
    UpdateLocaleRequest,
    PaginationQueryRequest,
    LocalizedKeyLabelResponse,
    UserVerifyEmailRequest,
    UserResponse,
    OtpChangePhoneResponse,
    OtpVerifyPhoneResponse,
    VerifyEmailUserResponse,
    BaseProfileResponse,
    ProfileResponse,
    DeviceSessionResponse,
    ProfileRequestResetPinResponse,
    UpdateUserDeviceSettingRequest,
    NotificationResponse,
    NotificationQueryRequest,
    MyListResponse,
} from '@/repositories/auth'
import { Observable } from 'rxjs'
import { VerifyOtpRequest } from '@/repositories/auth/verify-otp.request'
import { VerifyOtpResponse } from '@/repositories/auth/verify-otp.response'
import { 
    CreateProfileInput,
    CreateProfilePinInput, 
    UpdateProfilePinInput,
    UserChangePasswordInput,
    UserVerifyOtpInput,
    VerifyResetProfilePin,
} from '@/types/inputs'

export interface IAuthRepository {
    createNewUser(request: CreateUserRequest): Observable<CreateUserResponse>
    requestOtp(request: SendOtpRequest): Observable<SendOtpResponse>
    verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse>
    updateUserPreferences(userId: string, preferences: string[]): Observable<string[]>
    getCategories(): Observable<ListResponse<CategoryResponse>>
    login(identity: string, password: string): Observable<{ accessToken: string, refreshToken: string }>
    verifyEmail(request: UserVerifyEmailRequest): Observable<VerifyEmailUserResponse>
    getProfiles(token: string): Observable<ListResponse<BaseProfileResponse>>
    createProfilePin(token: string, arg: CreateProfilePinInput): Observable<ProfileResponse>
    changeProfilePin(token: string, arg: UpdateProfilePinInput): Observable<ProfileResponse>
    refreshToken(token: string): Observable<{ accessToken: string, refreshToken: string }>
    requestToChangePhoneNumber(token: string,phoneNumber: string): Observable<OtpChangePhoneResponse>
    verifyToChangePhoneNumber(token: string, input: UserVerifyOtpInput ): Observable<OtpVerifyPhoneResponse>
    changePassword(token: string, input: UserChangePasswordInput): Observable<OtpVerifyPhoneResponse>
    getProfileById(token: string, profileId: string): Observable<ProfileResponse>
    getCurrentUser(token: string): Observable<UserResponse>
    listUserSessions(): Observable<DeviceSessionResponse[]>
    revokeSingleSession(sessionId: string): Observable<DeviceSessionResponse>
    flushSessions(): Observable<{ids: string[]}>
    getContentRating(): Observable<string[]>
    requestToChangeEmail(token: string, newEmail: string): Observable<Omit<OtpChangePhoneResponse, 'remaining'>>
    verifyToChangeEmail(token: string, input: UserVerifyOtpInput ): Observable<OtpVerifyPhoneResponse>
    validateProfilePin(profileId: string, pin: string): Observable<{isValid: boolean}>
    createProfile(body: CreateProfileInput): Observable<ProfileResponse>
    requestTokenToResetPin(profileId: string, password: string): Observable<ProfileRequestResetPinResponse>
    verifyTokenToResetPin(input: VerifyResetProfilePin): Observable<ProfileResponse>
    updateUserSetting(input: UpdateUserDeviceSettingRequest): Observable<UserResponse>
    getNotification(paginationQueryRequest: NotificationQueryRequest): Observable<ListResponse<NotificationResponse>>
    readAllNotification(profileId: string): Observable<{ status: boolean }>
    readNotificationById(notificationId: string): Observable<NotificationResponse>
    getMyList(profileId: string): Observable<MyListResponse[]>
    addToMyList(profileId: string, programId: string): Observable<MyListResponse[]>
    removeFromMyList(profileId: string, programId: string): Observable<MyListResponse[]>
}

export interface ILocaleRepository {
    getById(token: string,id: string): Observable<LocaleResponse>
    deleteLabel(token: string,id: string): Observable<LocaleResponse>
    createLabel(token: string,request: CreateLocaleRequest): Observable<IdResponse>
    updateLabel(token: string,id: string, request: UpdateLocaleRequest): Observable<LocaleResponse>
    listLabels(token: string,paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>>
    listLocalizedKeyLabel(localeKey: string): Observable<ListResponse<LocalizedKeyLabelResponse>>
}
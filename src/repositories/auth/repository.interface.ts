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
    ProfileHasAccountInformationResponse,
} from '@/repositories/auth'
import { Observable } from 'rxjs'
import { VerifyOtpRequest } from '@/repositories/auth/verify-otp.request'
import { VerifyOtpResponse } from '@/repositories/auth/verify-otp.response'
import { 
    CreateProfilePinInput, 
    UpdateProfilePinInput,
    UserChangePasswordInput,
    UserVerifyOtpInput,
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
    getProfileAndAccountInformation(token: string, profileId: string): Observable<ProfileHasAccountInformationResponse>
    getCurrentUser(token: string): Observable<UserResponse>
    revokeSessions(token: string): Observable<{ids: string[]}>
    getContentRating(): Observable<string[]>
    requestToChangeEmail(token: string, newEmail: string): Observable<Omit<OtpChangePhoneResponse, 'remaining'>>
    verifyToChangeEmail(token: string, input: UserVerifyOtpInput ): Observable<OtpVerifyPhoneResponse>
}

export interface ILocaleRepository {
    getById(token: string,id: string): Observable<LocaleResponse>
    deleteLabel(token: string,id: string): Observable<LocaleResponse>
    createLabel(token: string,request: CreateLocaleRequest): Observable<IdResponse>
    updateLabel(token: string,id: string, request: UpdateLocaleRequest): Observable<LocaleResponse>
    listLabels(token: string,paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>>
    listLocalizedKeyLabel(localeKey: string): Observable<ListResponse<LocalizedKeyLabelResponse>>
}
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
} from '@/repositories/auth'
import { Observable } from 'rxjs'
import { VerifyOtpRequest } from '@/repositories/auth/verify-otp.request'
import { VerifyOtpResponse } from '@/repositories/auth/verify-otp.response'

export interface IAuthRepository {
    createNewUser(request: CreateUserRequest): Observable<CreateUserResponse>
    requestOtp(request: SendOtpRequest): Observable<SendOtpResponse>
    verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse>
    updateUserPreferences(userId: string, preferences: string[]): Observable<string[]>
    getCategories(): Observable<ListResponse<CategoryResponse>>
    login(identity: string, password: string): Observable<{ accessToken: string, refreshToken: string }>
}

export interface ILocaleRepository {
    getById(token: string,id: string): Observable<LocaleResponse>
    deleteLabel(token: string,id: string): Observable<LocaleResponse>
    createLabel(token: string,request: CreateLocaleRequest): Observable<IdResponse>
    updateLabel(token: string,id: string, request: UpdateLocaleRequest): Observable<LocaleResponse>
    listLabels(token: string,paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>>
    listLocalizedKeyLabel(localeKey: string): Observable<ListResponse<LocalizedKeyLabelResponse>>
}
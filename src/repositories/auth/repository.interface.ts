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
}

export interface ILocaleRepository {
    getById(id: string): Observable<LocaleResponse>
    delete(id: string): Observable<LocaleResponse>
    createLabel(request: CreateLocaleRequest): Observable<IdResponse>
    updateLabel(id: string, request: UpdateLocaleRequest): Observable<LocaleResponse>
    listLabels(paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>>
}
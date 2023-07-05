import {
    CreateUserRequest,
    CreateUserResponse,
    SendOtpRequest,
    SendOtpResponse,
} from '@/repositories/auth'
import { Observable } from 'rxjs'

export interface IAuthRepository {
    createNewUser(request: CreateUserRequest): Observable<CreateUserResponse>
    requestOtp(request: SendOtpRequest): Observable<SendOtpResponse>
}
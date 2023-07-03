import { CreateUserRequest } from '@/repositories/auth/create-user.request'
import { Observable } from 'rxjs'
import { CreateUserResponse } from '@/repositories/auth/create-user.response'

export interface IAuthRepository {
    createNewUser(request: CreateUserRequest): Observable<CreateUserResponse>
}
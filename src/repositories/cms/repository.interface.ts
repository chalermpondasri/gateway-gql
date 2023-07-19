import {
    BaseResponse,
    LoginResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import { Observable } from 'rxjs'
import { IBaseRequest } from '@/repositories/cms/base.request'

export interface ICmsRepository {
    getTermsAndConditions(request: IBaseRequest): Observable<BaseResponse<TermResponse>>
    login(identifier: string, password: string): Observable<LoginResponse>
    getUserData(userId: number): Observable<UserRoleResponse>
}

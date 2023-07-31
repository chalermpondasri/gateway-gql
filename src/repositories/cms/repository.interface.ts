import {
    BaseResponse,
    ListResponse,
    LoginResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import { Observable } from 'rxjs'
import { IBaseRequest } from '@/repositories/cms/base.request'
import { PromotionalResponse } from '@/repositories/cms/promotional.response'

export interface ICmsRepository {
    getTermsAndConditions(request: IBaseRequest): Observable<ListResponse<TermResponse>>
    login(identifier: string, password: string): Observable<LoginResponse>
    getUserData(userId: number): Observable<UserRoleResponse>
    getPromotionalContents(): Observable<ListResponse<BaseResponse<PromotionalResponse>>>
}

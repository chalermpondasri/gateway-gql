import {
    AvatarResponse,
    BaseResponse,
    FaqResponse,
    ListResponse,
    LoginResponse,
    SectionResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import { Observable } from 'rxjs'
import { 
    BaseRequest, 
    IBaseRequest, 
} from '@/repositories/cms/base.request'
import { PromotionalResponse } from '@/repositories/cms/promotional.response'

export interface ICmsRepository {
    getTermsAndConditions(request: IBaseRequest): Observable<ListResponse<TermResponse>>
    login(identifier: string, password: string): Observable<LoginResponse>
    getUserData(userId: number): Observable<UserRoleResponse>
    getPromotionalContents(): Observable<ListResponse<BaseResponse<PromotionalResponse>>>
    getFaqs(request: BaseRequest): Observable<ListResponse<BaseResponse<FaqResponse>>>
    getAvatars(id: number): Observable<ListResponse<BaseResponse<AvatarResponse>>>
    getMainPageSections(): Observable<ListResponse<BaseResponse<SectionResponse>>>
}

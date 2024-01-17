import {
    AvatarResponse,
    BaseResponse,
    CmsDataResponse,
    FaqResponse,
    ListResponse,
    LoginResponse,
    MediaContentDetailResponse,
    SectionResponse,
    TagResponse,
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
    getMediaContentById(id: string): Observable<CmsDataResponse<MediaContentDetailResponse>>
    getMediaContentBySlug(slug: string): Observable<CmsDataResponse<MediaContentDetailResponse>>
    getMediaContentByTags(tag: string[]): Observable<CmsDataResponse<MediaContentDetailResponse>>
    getTags(): Observable<BaseResponse<TagResponse>[]>
}

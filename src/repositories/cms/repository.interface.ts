import {
    AvatarResponse,
    BaseResponse,
    CmsDataResponse,
    FaqResponse,
    IQueryOptions,
    ListResponse,
    LoginResponse,
    MediaContentDetailResponse,
    MediaSeasonResponse,
    PredefinedSearchResponse,
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
import { ContentRating } from '@/types/enums'
import { CoinPackageResponse } from '@/repositories/cms/coin-package.response'

export interface ICmsRepository {
    getTermsAndConditions(request: IBaseRequest): Observable<ListResponse<TermResponse>>
    login(identifier: string, password: string): Observable<LoginResponse>
    getUserData(userId: number): Observable<UserRoleResponse>
    getPromotionalContents(): Observable<ListResponse<BaseResponse<PromotionalResponse>>>
    getFaqs(request: BaseRequest): Observable<ListResponse<BaseResponse<FaqResponse>>>
    getAvatars(id: number): Observable<ListResponse<BaseResponse<AvatarResponse>>>
    getMainPageSections(sectionId?: number| number[]): Observable<ListResponse<BaseResponse<SectionResponse>>>
    getMediaContentById(id: string): Observable<CmsDataResponse<MediaContentDetailResponse>>
    getMediaContentBySlug(slug: string): Observable<CmsDataResponse<MediaContentDetailResponse>>
    getMediaContentByTags(tag: string[], contentRatings?: ContentRating[]): Observable<ListResponse<BaseResponse<MediaContentDetailResponse>>>
    getTags(): Observable<BaseResponse<TagResponse>[]>
    getSeason(mediaContentId: string): Observable<ListResponse<BaseResponse<MediaSeasonResponse>>>
    getLatestContent(contentRatings: ContentRating[]) :Observable<CmsDataResponse<MediaContentDetailResponse>>
    getPredefinedSearches(): Observable<ListResponse<BaseResponse<PredefinedSearchResponse>>>
    getCoinPackages(): Observable<ListResponse<BaseResponse<CoinPackageResponse>>>
    getMediaContentsByIds(multipleId: number[], opts?: IQueryOptions): Observable<CmsDataResponse<MediaContentDetailResponse>>
}

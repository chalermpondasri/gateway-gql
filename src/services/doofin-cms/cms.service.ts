import {
    Inject,
    Injectable,
    Logger,
    LoggerService,
    UnauthorizedException,
} from '@nestjs/common'
import {
    concatMap,
    from,
    map,
    mergeMap,
    Observable,
    of,
    throwError,
    toArray,
} from 'rxjs'
import {
    BaseResponse,
    CmsImageContent,
    ContentRatingResponse,
    ICmsRepository,
    MediaContentResponse,
    MediaEpisodeResponse,
    TagResponse,
} from '@/repositories/cms'
import { BaseRequest } from '@/repositories/cms/base.request'
import { ProviderName } from '@/constants/provider-name.const'
import {
    AvatarType,
    TermType,
    CmsPromotionalContentType,
    CmsRoleType,
    CmsUserType,
    SectionType,
    SectionItemType,
} from '@/types/objects'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { capitalize } from 'lodash/fp'
import {
    get,
} from 'lodash'
import { 
    SubFaqType, 
    SubjectType, 
} from '@/types/objects/subject.type'
import { RequestContext } from '@/providers/request-context.provider'
import { LocalizedLabelType } from '@/types/objects/label.type'

@Injectable()
export class CmsService {

    private readonly _logger: LoggerService

    public constructor(
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
    ) {
        this._logger = new Logger(this.constructor.name)
    }

    public getLatestTerms(): Observable<TermType> {
        const request = new BaseRequest()
        request.sortMeta = {
            'publishedAt': 'desc',
        }
        return this._cmsRepository.getTermsAndConditions(request).pipe(
            map(({ data }) => {
                const { id, attributes } = data[0]
                return {
                    id,
                    createdAt: attributes.createdAt,
                    publishedAt: attributes.publishedAt,
                    updatedAt: attributes.updatedAt,
                    th: attributes.th,
                    en: attributes.en,
                }
            }),
        )
    }

    public localeManagerLogin(identity: string, password: string): Observable<CmsUserType> {
        return this._cmsRepository.login(identity, password).pipe(
            mergeMap(loginResponse => {
                return this._cmsRepository.getUserData(loginResponse.user.id).pipe(
                    map(userData => {
                        return { loginResponse, userData }
                    }),
                )
            }),
            mergeMap(({ loginResponse, userData }) => {
                if (!userData?.role?.type || userData?.role?.type !== 'locale_manager') {
                    return throwError(() => new UnauthorizedException('Unauthorized'))
                }

                const cmsUser = plainToInstance(CmsUserType, instanceToPlain(loginResponse.user))
                cmsUser.role = plainToInstance(CmsRoleType, instanceToPlain(userData.role))
                cmsUser.jwt = loginResponse.jwt
                return of(cmsUser)
            }),
        )

    }

    public getPromotionalContent(locale: string): Observable<CmsPromotionalContentType[]> {
        return this._cmsRepository.getPromotionalContents().pipe(
            concatMap(result => {
                return from(result.data)
            }),
            map(data => {
                const langSuffix = capitalize(locale)

                const title = get(data, `attributes.title${langSuffix}`) ?? get(data, `attributes.titleEn}`)
                const description = get(data, `attributes.description${langSuffix}`) ?? get(data, `attributes.descriptionEn}`)
                const result = new CmsPromotionalContentType()
                const {
                    imageMobile,
                    imageWeb,
                } = data.attributes
                result.id = data.id
                result.description = description
                result.title = title
                result.imageWeb = (<BaseResponse<CmsImageContent>> imageWeb.data).attributes
                result.imageMobile = (<BaseResponse<CmsImageContent>> imageMobile.data).attributes

                return result
            }),
            toArray(),
        )
    }

    public getFaqs(locale: string = 'en'): Observable<SubjectType[]> {
        const request = new BaseRequest()
        request.sortMeta = {
            'seq': 'asc',
        }
        return this._cmsRepository.getFaqs(request).pipe(
            concatMap(faqResponse => from(faqResponse.data)),
            map(faq => {   
                const langSuffix = capitalize(locale)
                const result = new SubjectType()
                result.id = faq.id
                result.subject = get(faq, `attributes.subject${langSuffix}`) ?? get(faq, `attributes.subjectEn}`)
                result.subFaq = faq.attributes.subFaq.sort((a,b)=> a.seq - b.seq).map(e=>{
                    const sub:SubFaqType = {
                        id: e.id,
                        subject: get(e, `subject${langSuffix}`) ?? get(e, `subjectEn`),
                        content: get(e, `content${langSuffix}`) ?? get(e, `contentEn`),
                    }
                    return plainToInstance(SubFaqType, sub)
                })
                return result
            }),
            toArray(),
        )
    }

    public getAvatars(id: number): Observable<AvatarType[]> {
        return this._cmsRepository.getAvatars(id).pipe(
            concatMap(avatarRes => from(avatarRes.data)),
            map((res) => {
                const preMap = new AvatarType()
                preMap.id = res.id
                preMap.color = res.attributes.color
                preMap.resourcePath = res.attributes.resourcePath.data.attributes
                return preMap
            }),
            toArray(),
        )
    }

    public getMainPageSections(): Observable<SectionType[]> {
        const lang = this._requestContext.languages[0].code
        return this._cmsRepository.getMainPageSections().pipe(
            concatMap(result => from(result.data)),
            map(sectionResponse => {

                const { attributes } = sectionResponse
                const section = new SectionType()
                section.id = sectionResponse.id
                section.sectionTitle = attributes.title[lang]
                section.sectionType =attributes.sectionType
                section.sectionLink = attributes.sectionLink
                section.sectionSubtitle = attributes.subtitle? attributes.subtitle[lang] : null
                section.order = attributes.order
                section.createdAt = new Date(attributes.createdAt)
                section.updatedAt = new Date(attributes.updatedAt)

                section.sectionItems = (attributes.items.data as BaseResponse<MediaContentResponse>[]).map( i=>{
                    const item = new SectionItemType()
                    item.id = i.id
                    item.contentRating = (<BaseResponse<ContentRatingResponse>> i.attributes.rating.data).attributes.value
                    item.coverImage = (<BaseResponse<CmsImageContent>> i.attributes.coverImage.data).attributes
                    item.trailers = i.attributes.trailers
                    item.title = i.attributes.title[lang]
                    item.link = i.attributes.link

                    let tags: LocalizedLabelType[] = []
                    if(!!i.attributes.mediaTags.data) {
                        tags = (<BaseResponse<TagResponse>[]>i.attributes.mediaTags.data).map( t => {
                            const label = new LocalizedLabelType()
                            label.id = t.attributes.slug
                            label.label = t.attributes.name[lang]
                            return label
                        })
                    }
                    item.tags = tags

                    item.shortVideos = []

                    item.episodes  = (<BaseResponse<MediaEpisodeResponse>[]> i.attributes.media_episodes.data).map( v => {
                        return {
                            id: v.id,
                            coverImage: (<BaseResponse<CmsImageContent>> v.attributes.coverImage.data).attributes,
                            order: v.attributes.ordering,
                            duration: String(v.attributes.duration),
                            episodeName: v.attributes.name[lang],
                            continueWatchingAt: 0
                        }
                    })

                    return item
                })


                return section
            }),
            toArray(),
        )
    }

}
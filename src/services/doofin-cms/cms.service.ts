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
    ICmsRepository,
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
                result.imageWeb = imageWeb.data.attributes
                result.imageMobile = imageMobile.data.attributes

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
        return this._cmsRepository.getMainPageSections().pipe(
            concatMap(result => from(result.data)),
            map(item => {
                const { attributes } = item
                const section = new SectionType()
                section.id = item.id
                section.sectionTitle = attributes.sectionTitle
                section.sectionType =attributes.sectionType
                section.sectionLink = attributes.sectionLink
                section.sectionSubtitle = attributes.sectionSubtitle
                section.order = attributes.order
                section.createdAt = new Date(attributes.createdAt)
                section.updatedAt = new Date(attributes.updatedAt)

                section.sectionItems = attributes.sectionItems.map( i=>{
                    const item = new SectionItemType()
                    item.id = i.id
                    item.contentRating = i.contentRating
                    item.coverImage = i.coverImage.data.attributes
                    item.trailer = i.trailer
                    item.title = i.title
                    item.link = i.link
                    item.tags = i.tags ? i.tags.split(',') : []
                    item.shortVideo = i.shortVideo
                    item.episodes  = i.episodes.map( v => {
                        return {
                            id: v.id,
                            coverImage: v.coverImage.data.attributes,
                            order: v.order,
                            duration: String(v.duration),
                            episodeName: v.episodeName,
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
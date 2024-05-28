import {
    Inject,
    Injectable,
    Logger,
    LoggerService,
    UnauthorizedException,
} from '@nestjs/common'
import {
    catchError,
    concatMap,
    defaultIfEmpty,
    filter,
    find,
    from,
    iif,
    map,
    mergeMap,
    Observable,
    of,
    tap,
    throwError,
    toArray,
} from 'rxjs'
import {
    BaseResponse,
    CmsImageContent,
    ContentRatingResponse,
    ICmsRepository,
    KeyValueResponse,
    LocaleTextResponse,
    MediaContentDetailResponse,
    MediaContentResponse,
    MediaEpisodeResponse,
    MediaSeasonResponse,
    PersonResponse,
    TagResponse,
} from '@/repositories/cms'
import { BaseRequest } from '@/repositories/cms/base.request'
import { ProviderName } from '@/constants/provider-name.const'
import {
    AvatarType,
    CmsImageType,
    CmsPromotionalContentType,
    CmsRoleType,
    CmsUserType,
    CoinPackageType,
    ExternalContentType,
    LatestPlayedType,
    MediaContentDetailType,
    MediaDurationType,
    MediaEpisodeType,
    MediaSeasonType,
    PresetSearchType,
    SectionItemType,
    SectionType,
    TermType,
} from '@/types/objects'
import {
    instanceToPlain,
    plainToClassFromExist,
    plainToInstance,
} from 'class-transformer'
import { capitalize } from 'lodash/fp'
import {
    get,
    isEmpty,
    isNil,
    reduce,
    size,
    some,
} from 'lodash'
import {
    SubFaqType,
    SubjectType,
} from '@/types/objects/subject.type'
import { RequestContext } from '@/providers/request-context.provider'
import { LocalizedLabelType } from '@/types/objects/label.type'
import { IAuthRepository } from '@/repositories/auth'
import {
    ContentRating,
    ContentRatingValidation,
    Locale,
} from '@/types/enums'
import { ICacheService } from '@/services/cache/interface/service.interface'
import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import { RentalStatus } from '@/types/enums/rental-status.enum'
import { SearchService } from '@/services/search/services/search.service'
import { LatestPlayedContentResponse } from '@/repositories/playback/latest-played-content.response'
import * as console from 'console'

@Injectable()
export class CmsService {

    private readonly _logger: LoggerService

    public constructor(
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
        @Inject(ProviderName.CONTENT_RATING_VALIDATION)
        private readonly _ratingValidation: ContentRatingValidation,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
        @Inject(ProviderName.PLAYBACK_REPOSITORY)
        private readonly _playbackRepository: IPlaybackRepository,
        @Inject(SearchService)
        private readonly _searchService: SearchService,
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
                result.imageWeb = (<BaseResponse<CmsImageContent>>imageWeb.data).attributes
                result.imageMobile = (<BaseResponse<CmsImageContent>>imageMobile.data).attributes

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
                result.subFaq = faq.attributes.subFaq.sort((a, b) => a.seq - b.seq).map(e => {
                    const sub: SubFaqType = {
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

    public getMainPageSections(sectionId?: number): Observable<SectionType[]> {
        console.time('getMainPageSections')
        const lang = this._requestContext.languages[0].code
        return this._cmsRepository.getMainPageSections(sectionId).pipe(
            concatMap(result => from(result.data)),
            mergeMap(sectionResponse => {
                console.time(`getMainPageSections_${sectionResponse.id}`)
                const { attributes } = sectionResponse
                const section = new SectionType()
                section.id = sectionResponse?.id ?? 0
                section.sectionTitle = attributes?.title[lang] ?? ''
                section.sectionType = attributes?.sectionType ?? ''
                section.sectionLink = attributes?.sectionLink ?? ''
                section.sectionSubtitle = attributes?.subtitle ? attributes.subtitle[lang] : ''
                section.order = attributes?.order ?? 0
                section.createdAt = new Date(attributes.createdAt)
                section.updatedAt = new Date(attributes.updatedAt)
                section.coverImage = (<BaseResponse<CmsImageContent>>attributes?.coverImage?.data)?.attributes

                if (section.coverImage) {
                    section.coverImage.id = (<BaseResponse<CmsImageContent>>attributes?.coverImage?.data)?.id
                }

                section.sectionItems = []
                const rawSectionItems = (attributes.items?.data as BaseResponse<MediaContentResponse>[] ?? [])

                if (section.sectionType === 'top') {
                    return of(section).pipe(
                        mergeMap((section) => (this._searchService[attributes.internalResourcePath]() as Observable<BaseResponse<MediaContentDetailResponse>[]>).pipe(
                            defaultIfEmpty([]),
                            map(result => result.map((v: BaseResponse<MediaContentResponse>) => this._toSectionItemType(v, lang))),
                            map(items => {
                                section.sectionItems = items
                                return section
                            }),
                        )),
                    )
                }

                if (section.sectionType === 'continue-watching') {
                    return this.getContinueWatchingSectionItems().pipe(
                        map(result => {
                            section.sectionItems = result
                            return section
                        }),
                    )
                }

                return of(section).pipe(
                    map(section => {
                        section.sectionItems = rawSectionItems.map(i => this._toSectionItemType(i, lang))
                        return section
                    }),
                )
            }),
            filter(v => !isEmpty(v.sectionItems)),
            tap(result => console.timeEnd(`getMainPageSections_${result.id}`)),
            toArray(),
            tap(() => console.timeEnd('getMainPageSections'))
        )
    }

    private _getLatestPlayedContentFromCache(): Observable<LatestPlayedContentResponse[]> {
        const cacheKey = `${this._playbackRepository.getLatestPlayedContent.name}_P:${this._requestContext.profileId}`

        return this._cacheService.getCache(cacheKey).pipe(
            mergeMap(dataString => {
                if (!isNil(dataString)) {
                    const json: unknown[] = JSON.parse(dataString)
                    const result = plainToInstance(LatestPlayedContentResponse, json)
                    return of(result)
                }
                return this._playbackRepository.getLatestPlayedContent(this._requestContext.profileId).pipe(
                    catchError((err, caught) => {
                        console.error({ err, caught })
                        return []
                    }),
                    tap(result => this._cacheService.setCache(cacheKey, JSON.stringify(result), 15)),
                )
            }),
        )
    }

    public getContinueWatchingSectionItems(): Observable<SectionItemType[]> {
        return this._getLatestPlayedContentFromCache().pipe(
            concatMap(v => from(v)),
            mergeMap(v => {
                return this._cmsRepository.getMediaContentById(String(v.contentId)).pipe(
                    map(content => {
                        const d = <BaseResponse<MediaContentDetailResponse>>content.data
                        return this._toSectionItemType(d, this._requestContext.languages[0].code)
                    }),
                )
            }),
            toArray(),
        )
    }

    public getMediaContentById(id: string): Observable<MediaContentDetailType> {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return iif(
            () => Number.isInteger(Number(id)),
            this._cmsRepository.getMediaContentById(id),
            this._cmsRepository.getMediaContentBySlug(id),
        )
            .pipe(
                map(res => (res.data) as BaseResponse<MediaContentDetailResponse>),
                map((res) => CmsService.toMediaContentDetailType(res, lang)),
            )
    }

    public isSeries(tags: LocalizedLabelType[]) {
        return some(tags, { id: 'series' })
    }

    public getTotalSeason(media: MediaContentDetailType): Observable<number> {
        return this._cmsRepository.getSeason(media.id.toString()).pipe(
            map(data => data.meta.pagination.total),
        )
    }

    public getCaptionAudioOrTotalEp(media: MediaContentDetailType, want: 'audio' | 'caption' | 'totalEp'): Observable<number | string[]> {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return this._cmsRepository.getSeason(media.id.toString()).pipe(
            map((data) => {
                if (data.meta.pagination.total === 0) {
                    return want === 'audio' || want === 'caption' ? [] : 0
                }
                const { captions, audio, totalEp } = CmsService.countAudioSubtitleAndTotalEp(data.data, media.id, lang)
                return want === 'audio' ? audio : want === 'caption' ? captions : totalEp
            }),
        )
    }

    public static toMediaContentDetailType(resp: BaseResponse<MediaContentDetailResponse>, lang: string): MediaContentDetailType {
        const { attributes } = resp
        const result = new MediaContentDetailType()
        result.id = resp.id
        const title = get(attributes, `title.${lang}`, attributes?.title?.en ?? '')
        result.title = !!title ? title : ''
        const subTitle = get(attributes, `subtitle.${lang}`, get(attributes, 'subtitle.en', ''))
        result.subtitle = !!subTitle ? subTitle : ''
        result.contentRating = (<BaseResponse<ContentRatingResponse>>attributes?.rating?.data)?.attributes?.value ?? ''
        result.coverImage = (<BaseResponse<CmsImageContent>>attributes?.coverImage?.data)?.attributes
        if (result.coverImage) {
            result.coverImage.id = (<BaseResponse<CmsImageContent>>attributes?.coverImage?.data)?.id
        }
        result.trailers = plainToInstance(ExternalContentType, attributes?.trailers ?? [])
        result.link = plainToInstance(ExternalContentType, get(attributes, 'link', {}))
        result.shortVideos = []
        result.slug = attributes?.slug ?? ''

        const personMapper = (e: BaseResponse<PersonResponse>) => {
            const img: CmsImageType = get(e, 'attributes.portrait.data.attributes', null)
            if (img) {
                img.id = get(e, 'attributes.portrait.data.id', 0)
            }
            return {
                id: e.id,
                name: get(e, 'attributes.name', ''),
                portrait: img,
            }
        }
        result.casts = (get(attributes, 'casts.data', []) as BaseResponse<PersonResponse>[]).map(personMapper)
        result.director = (get(attributes, 'directors.data', []) as BaseResponse<PersonResponse>[]).map(personMapper)

        let tags: LocalizedLabelType[] = []
        if (!!attributes.mediaTags.data) {
            tags = (<BaseResponse<TagResponse>[]>attributes.mediaTags.data).map((t) => {
                const label = new LocalizedLabelType()
                label.id = t.attributes.slug
                label.label = t.attributes.name[lang]
                return label
            })
        }
        result.tags = tags
        result.totalSeason = size(attributes.mediaSeasons.data)

        const {
            captions,
            audio,
            totalEp,
            newSeasons,
        } = this.countAudioSubtitleAndTotalEp(get(attributes, 'mediaSeasons.data', []) as BaseResponse<MediaSeasonResponse>[], resp.id, lang)

        result.totalEpisode = totalEp
        result.captions = captions
        result.audios = audio
        //* move to season
        result.episodes = []

        result.seasons = newSeasons
        return result

    }

    private _toSectionItemType(mediaContent: BaseResponse<MediaContentResponse>, lang: string): SectionItemType {
        const item = new SectionItemType()
        item.id = mediaContent.id
        item.contentRating = (<BaseResponse<ContentRatingResponse>>mediaContent?.attributes?.rating?.data)?.attributes?.value ?? ''
        item.coverImage = (<BaseResponse<CmsImageContent>>(mediaContent?.attributes?.coverImage?.data))?.attributes
        if (item.coverImage) {
            item.coverImage.id = (<BaseResponse<CmsImageContent>>(mediaContent?.attributes?.coverImage?.data))?.id
        }
        item.trailers = get(mediaContent, 'attributes.trailers', []).map(t => plainToInstance(ExternalContentType, t))
        item.title = mediaContent?.attributes?.title[lang] ?? ''
        item.subtitle = mediaContent?.attributes?.subtitle[lang] ?? ''

        item.link = plainToInstance(ExternalContentType, get(mediaContent, 'attributes.link', {}))
        item.slug = mediaContent?.attributes?.slug ?? ''

        let tags: LocalizedLabelType[] = []
        if (!!mediaContent.attributes.mediaTags.data) {
            tags = (<BaseResponse<TagResponse>[]>mediaContent.attributes.mediaTags.data).map((t) => {
                const label = new LocalizedLabelType()
                label.id = t.attributes.slug
                label.label = t.attributes.name[lang]
                return label
            })
        }
        item.tags = tags
        item.shortVideos = []
        //? move to mediaContentDetail.season
        item.episodes = []

        item.isSeries = this.isSeries(tags)
        item.totalSeason = size(mediaContent.attributes.mediaSeasons?.data ?? [])
        item.totalEpisode = reduce(
            <BaseResponse<MediaSeasonResponse>[]>mediaContent.attributes.mediaSeasons?.data ?? [],
            (acc, each) => {
                return acc + size(each.attributes.mediaEpisodes.data)
            },
            0,
        )
        const topSection = (<BaseResponse<CmsImageContent>>mediaContent.attributes.imageTopSection?.data)

        item.imageTopSection = topSection?.attributes

        if(!!topSection) {
            item.imageTopSection.id = topSection?.id
        }

        const imageCard = (<BaseResponse<CmsImageContent>>mediaContent.attributes.imageCard?.data)
        if(!!imageCard) {

            item.imageCard = imageCard.attributes
            item.imageCard.id = imageCard.id
        }

        const imageHeroBanner = (<BaseResponse<CmsImageContent>>mediaContent.attributes.imageHeroBanner?.data)
        item.imageHeroBanner = imageHeroBanner.attributes
        item.imageHeroBanner.id = imageHeroBanner.id

        item.mediaContentDetail = CmsService.toMediaContentDetailType(mediaContent, lang)
        return item

    }

    private _getEpisodeDetailById(seasons: MediaSeasonType[], epId: number): Observable<MediaEpisodeType> {
        return from(seasons).pipe(
            concatMap(season => from(season.mediaEpisodes)),
            find(ep => ep.id === epId),
        )
    }

    public getKidFin(): Observable<SectionItemType[]> {
        const lang = this._requestContext.languages[0].code
        return this._cmsRepository.getMediaContentByTags(['kids']).pipe(
            map(res => (res.data) as Array<BaseResponse<MediaContentResponse>>),
            concatMap((datas) => from(datas)),
            map(mediaContent => this._toSectionItemType(mediaContent, lang)),
            toArray(),
        )

    }

    public searchContentByTag(profileId: string, tags?: string[]) {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return this._getCurrentRating(profileId).pipe(
            mergeMap((ratings) => this._cmsRepository.getMediaContentByTags(tags, ratings)),
            map(res => (res.data) as Array<BaseResponse<MediaContentResponse>>),
            concatMap((datas) => from(datas)),
            map((res) => CmsService.toMediaContentDetailType(res, lang)),
            toArray(),
        )
    }

    public getSeason(media: MediaContentDetailType): Observable<MediaSeasonType[]> {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return this._cmsRepository.getSeason(media.id.toString()).pipe(
            concatMap(data => from(data.data)),
            map(season => CmsService.seasonMapper(media.id, season, lang)),
            toArray(),
        )
    }

    public getPresetSearches(presetId?: number): Observable<PresetSearchType[]> {
        const lang = <keyof Locale>this._requestContext.languages[0].code

        return this._cmsRepository.getPredefinedSearches().pipe(
            concatMap(result => from(result.data)),
            filter(data => !presetId || presetId === data.id),
            map(data => {
                const tags = <BaseResponse<TagResponse>[]>data.attributes.includeTags.data
                const exclTags = <BaseResponse<TagResponse>[]>data.attributes.excludeTags.data

                const coverImage: CmsImageType = get(data, 'attributes.coverImage.data.attributes', null)
                if (coverImage) {
                    coverImage.id = get(data, 'attributes.coverImage.data.id', 0)
                }
                const type: PresetSearchType = {
                    id: data.id,
                    coverImage,
                    expanded: data.attributes.expanded,
                    includeTags: tags.map(v => ({
                        id: v.attributes.slug,
                        label: this._resolveLocaleText(v.attributes.name, lang),
                    })),
                    excludeTags: exclTags.map(v => ({
                        id: v.attributes.slug,
                        label: this._resolveLocaleText(v.attributes.name, lang),
                    })),
                    order: data.attributes.order,
                    url: data.attributes.url,
                    title: this._resolveLocaleText(data.attributes.title, lang),
                    contents: [],
                }
                return type

            }),
            toArray(),
        )
    }

    public getMediaContentByTags(includeTags: string[], excludeTags: string[] = []): Observable<MediaContentDetailType[]> {
        const lang = this._requestContext.languages[0].code

        const cacheKey = `getPresetSearches_${String(lang)}_${includeTags.join('+')}_${excludeTags.join('-')}`

        return this._cacheService.getCache(cacheKey).pipe(
            mergeMap(cacheData => {
                return iif(() => !!cacheData,
                    of(JSON.parse(cacheData)),
                    this._cmsRepository.getMediaContentByTags(includeTags).pipe(
                        concatMap(result => from(result.data)),
                        filter(data => {
                            const tagResponse = <BaseResponse<TagResponse>[]>data.attributes.mediaTags.data
                            const tagSlugs = tagResponse.map(v => v.attributes.slug)
                            return !tagSlugs.some(cursor => excludeTags.includes(cursor))
                        }),
                        map(result => CmsService.toMediaContentDetailType(result, lang)),
                        toArray(),
                        tap(data => this._cacheService.setCache(cacheKey, JSON.stringify(data), 3600)),
                    ),
                )
            }),
        )
    }

    private _resolveLocaleText(localeText: LocaleTextResponse, lang: keyof Locale) {
        return get(localeText, lang) ?? get(localeText, 'en', '')
    }

    public static countAudioSubtitleAndTotalEp(
        seasons: BaseResponse<MediaSeasonResponse>[],
        mediaContentId: number,
        lang: string,
    ): { captions: string[], audio: string[], totalEp: number, newSeasons: Array<MediaSeasonType> } {
        return seasons.reduce(
            (a, c) => {
                const episodes = get(c, 'attributes.mediaEpisodes.data', []) as BaseResponse<MediaEpisodeResponse>[]

                const cap = episodes.flatMap((m) => {
                    return (get(m, 'attributes.subtitle', []) as KeyValueResponse[])
                        .flatMap((n) => n.key)
                        .filter((n) => !!n)
                })
                const audi = episodes.flatMap((m) => {
                    return (get(m, 'attributes.audio', []) as KeyValueResponse[])
                        .flatMap((n) => n.key)
                        .filter((n) => !!n)
                })
                const total = size(episodes)

                a.captions = a.captions.concat(cap)
                a.audio = a.audio.concat(audi)
                a.totalEp += total
                a.newSeasons.push(CmsService.seasonMapper(mediaContentId, c, lang))
                return a
            },
            { captions: [], audio: [], totalEp: 0, newSeasons: [] },
        )
    }

    public getNewFin() {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return this._getCurrentRating().pipe(
            mergeMap((ratings) => this._cmsRepository.getLatestContent(ratings)),
            concatMap(res => from(res.data as Array<BaseResponse<MediaContentDetailResponse>>)),
            map((data) => this._toSectionItemType(data, lang)),
            toArray(),
        )
    }

    public static seasonMapper(mediaContentId: number, season: BaseResponse<MediaSeasonResponse>, lang: string) {

        const episodeMapper = (ep: BaseResponse<MediaEpisodeResponse>) => {
            const img: CmsImageType = get(ep, 'attributes.coverImage.data.attributes', null)
            if (img) {
                img.id = get(ep, 'attributes.coverImage.data.id', 0)
            }
            const duration: MediaDurationType = get(ep, 'attributes.duration', null)
            const price = get(ep, 'attributes.price', 0)

            let rentalStatus: RentalStatus
            if (price === 0) {
                rentalStatus = RentalStatus.FREE_TO_WATCH
            } else if (price > 0 && !!duration?.freeDuration && duration?.freeDuration > 0) {
                rentalStatus = RentalStatus.FREE_TRIAL
            } else {
                rentalStatus = RentalStatus.SUBSCRIPTION_NEEDED
            }
            const newEp: MediaEpisodeType = {
                audio: (get(ep, 'attributes.audio', []) as KeyValueResponse[]).map(e => e.key),
                captions: (get(ep, 'attributes.subtitle', []) as KeyValueResponse[]).map(e => e.key),
                order: get(ep, 'attributes.ordering', 0),
                duration,
                episodeName: get(ep, `attributes.name.${lang}`, get(ep, 'attributes.name.en', '')),
                coverImage: img,
                id: ep.id,
                mediaContentId: mediaContentId,
                videoId: get(ep, 'attributes.videoId', ''),
                //* resolve field
                continueWatchingAt: 0,
                price,
                rentalStatus,
            }
            return newEp
        }

        const newSeason: MediaSeasonType = {
            slug: get(season, 'attributes.slug'),
            name: get(season, `attributes.name.${lang}`, season.attributes.name.en),
            ordering: get(season, 'attributes.ordering', 0),
            mediaEpisodes: (get(season, 'attributes.mediaEpisodes.data', []) as BaseResponse<MediaEpisodeResponse>[]).map(episodeMapper),
            id: season.id.toString(),
        }
        return newSeason
    }

    public getContinueWatching(profileId: string, mediaContentId: string, epId: string): Observable<number> {
        const currentProfileId = !!profileId ? profileId : this._requestContext.profileId
        return this._playbackRepository.getPlaybackStatus(currentProfileId, mediaContentId).pipe(
            map(watchingDetail => {
                return watchingDetail[String(epId)] ?? 0
            }),
        )
    }

    public getCoinPackages(): Observable<CoinPackageType[]> {
        return this._cmsRepository.getCoinPackages()
            .pipe(
                concatMap(response => from(response.data)),
                map(data => {
                    const coin = new CoinPackageType()
                    coin.id = data.id
                    coin.price = data.attributes.price
                    coin.coinGain = data.attributes.coinGain
                    coin.coinBonusIndicator = data.attributes.coinBonusIndicator
                    coin.tier = data.attributes.tier
                    coin.tag = data.attributes.tag.map(t => t.label)
                    return coin
                }),
                toArray(),
            )
    }

    private _getCurrentProfileId(profileIdInput?: string): string {
        return !!profileIdInput ? profileIdInput : this._requestContext.profileId
    }

    private _getCurrentRating(profileId?: string): Observable<Array<ContentRating>> {
        return of(this._getCurrentProfileId(profileId)).pipe(
            mergeMap(pfId => {
                if (!pfId) return of<Array<ContentRating>>([])
                return this._authRepository.getProfileById(pfId).pipe(
                    map(pfDetail => {
                        return this._ratingValidation.getValue(pfDetail.contentRating as ContentRating)
                    }),
                )
            }),
        )
    }

    public getTotalDuration(media: MediaContentDetailType): Observable<number> {
        return this.getMediaContentById(String(media.id)).pipe(
            map(() => {
                if (this.isSeries(media.tags)) {
                    return null
                }
                const duration = media.seasons[0]?.mediaEpisodes[0]?.duration?.duration
                return !!duration ? Number(duration) : null
            }),
            catchError(err => {
                this._logger.error(`[TotalDuration] : ${err.message}`)
                return of(null)
            }),
        )
    }

    public getLatestPlayed(mediaContentId: number): Observable<LatestPlayedType> {
        return this._getLatestPlayedContentFromCache().pipe(
            map((v) => v.find(element => mediaContentId === element.contentId)),
            defaultIfEmpty(null),
            mergeMap((v: LatestPlayedContentResponse) => {
                if (!v) {
                    return of(null)
                }
                return this.getMediaContentById(mediaContentId.toString()).pipe(
                    mergeMap(contentDetail => {
                        return this._getEpisodeDetailById(contentDetail.seasons, v.episodeId)
                    }),
                    map(findResult => {
                        return plainToClassFromExist(new LatestPlayedType, {
                            latestPlayedEpisodeId: v.episodeId,
                            latestPlayedPosition: v.latestPosition,
                            latestPlayedFullDuration: isNil(findResult) ? 0 : findResult.duration.duration,
                        })
                    }),
                )
            }),
        )
    }

    public isAddedToMyList(mediaContentId: number): Observable<boolean> {
        const profileId = this._requestContext.profileId
        if (isNil(profileId)) {
            return of(false)
        }
        return this._authRepository.getMyList(profileId).pipe(
            map(result => {
                return result.some(value => String(value.programId) === String(mediaContentId))
            }),
        )
    }
}

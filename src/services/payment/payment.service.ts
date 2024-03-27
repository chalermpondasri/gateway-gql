import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    catchError,
    from,
    map,
    mergeMap,
    Observable,
    of,
    tap,
    toArray,
} from 'rxjs'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import {
    instanceToPlain,
    plainToClassFromExist,
    plainToInstance,
} from 'class-transformer'
import {
    PaginatedPaymentTransactionType,
    PaymentTransactionType,
} from '@/types/objects/payment.type'
import { RentalStatus } from '@/types/enums/rental-status.enum'
import { ICacheService } from '@/services/cache/interface/service.interface'
import { RequestContext } from '@/providers/request-context.provider'
import {
    MediaContentDetailType,
    MediaEpisodeType,
} from '@/types/objects'
import { SubscriptionResponse } from '@/repositories/payment/subscriptions.response'
import {
    CoinConsumptionHistoryType,
    PaginatedCoinConsumptionHistory,
} from '@/types/objects/coin-consumption-history.type'
import {
    BaseResponse,
    ICmsRepository,
    LocaleTextResponse,
    MediaContentDetailResponse,
    MediaEpisodeResponse,
    MediaSeasonResponse,
} from '@/repositories/cms'
import * as console from 'console'
import { Locale } from '@/types/enums'
import {
    flatMap,
    get,
} from 'lodash'
import { PaginationInput } from '@/types/inputs/pagination.input'
import {
    LatestSubscriptionType,
    PaginatedLatestSubscriptionType,
} from '@/types/objects/latest-subscription.type'
import { CmsService } from '@/services/doofin-cms/cms.service'

export class PaymentService {
    public constructor(
        @Inject(ProviderName.PAYMENT_REPOSITORY)
        private readonly _paymentRepository: IPaymentRepository,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
    ) {
    }

    public createPaymentTransaction(): Observable<string> {
        return this._paymentRepository.createPaymentToken().pipe(
            map(response => response.transactionToken),
        )
    }

    public checkoutCoinPackage(packageId: number, transactionToken: string): Observable<CheckoutPackageType> {
        return this._paymentRepository.checkoutPackage(packageId, transactionToken).pipe(
            map(data => plainToInstance(CheckoutPackageType, { packageId, total: data.total })),
        )
    }

    public getPaymentHistory(page: number, limit: number): Observable<PaginatedPaymentTransactionType> {
        return this._paymentRepository.getPaymentHistory(page, limit).pipe(
            map(response => {

                const result = plainToClassFromExist(new PaginatedPaymentTransactionType(), response)

                result.data = plainToInstance(Array<PaymentTransactionType>, instanceToPlain(result.data))

                return result

            }),
        )
    }

    public rentContent(mediaId: number, episodeId: number): Observable<boolean> {
        return this._paymentRepository.rent(mediaId, episodeId).pipe(
            map(result => result.success),
        )
    }

    public getRentalStatus(parent: MediaEpisodeType): Observable<RentalStatus> {
        return of(plainToInstance(MediaEpisodeType, parent)).pipe(
            mergeMap((ep) => this._paymentRepository.getSubscribeContents().pipe(
                catchError(() => of([] as SubscriptionResponse[])),
                map(result => ({ result, ep })),
            )),
            map(({ result, ep }) => {

                if (result.length !== 0 && result.some(v => v.episodeId === parent.id && v.mediaContentId === parent.mediaContentId)) {
                    return RentalStatus.SUBSCRIBED
                }

                return ep.rentalStatus
            }),
            tap(console.log),
        )
    }

    public coinConsumptionHistory(page: number, limit: number): Observable<PaginatedCoinConsumptionHistory> {
        return this._paymentRepository.getSubscribeContents().pipe(
            map(result => {
                const start = (page - 1) * limit
                const lim = (limit * page)
                return {
                    total: result.length,
                    subscribed: result.slice(start, lim),
                }
            }),
            mergeMap(({ subscribed, total }) => {
                const contentId = subscribed.map(v => v.mediaContentId)
                return this._cmsRepository.getMediaContentsByIds(contentId).pipe(
                    map(media => ({ media, subscribed, total })),
                )
            }),
            map(({ media, subscribed, total }) => {
                const lang = this._requestContext.languages[0].code as keyof Locale
                const result = (<BaseResponse<MediaContentDetailResponse>[]>media.data).reduce(([content, episode], v) => {
                    content[v.id] = v

                    const ep = flatMap((<BaseResponse<MediaSeasonResponse>[]>v.attributes.mediaSeasons.data).map(v => v.attributes.mediaEpisodes.data))
                        .reduce((a, e) => {
                            a[e.id] = e
                            return a
                        }, {})

                    return [content, Object.assign({ ...episode, ...ep })]
                }, [{}, {}])

                const contents = result[0]
                const episodes = result[1]

                const paginationResult = new PaginatedCoinConsumptionHistory()
                paginationResult.total = total
                paginationResult.page = page
                paginationResult.limit = limit
                paginationResult.data = subscribed.map(sub => {
                    const cc = new CoinConsumptionHistoryType()
                    cc.id = sub.id
                    cc.coinSpent = sub.coinSpent
                    cc.rentAt = sub.rentAt
                    cc.contentId = sub.mediaContentId
                    cc.episodeId = sub.episodeId
                    cc.contentTitle = this._resolveLocaleText((<BaseResponse<MediaContentDetailResponse>>contents[sub.mediaContentId]).attributes.title, lang)
                    cc.episodeTitle = this._resolveLocaleText((<BaseResponse<MediaEpisodeResponse>>episodes[sub.episodeId]).attributes.name, lang)
                    return cc
                })
                return paginationResult
            }),
        )

    }
    private _getMediaContentById(id: string): Observable<MediaContentDetailType> {
        const lang = this._requestContext.languages[0].code ?? 'en'
        return this._cmsRepository.getMediaContentById(id).pipe(
                map(res => (res.data) as BaseResponse<MediaContentDetailResponse>),
                map((res) => CmsService.toMediaContentDetailType(res, lang)),
            )
    }
    public latestSubscriptions(pagination: PaginationInput): Observable<PaginatedLatestSubscriptionType> {
        return this._paymentRepository.getLatestSubscriptions(pagination.limit, pagination.page).pipe(
            mergeMap(({ data, total }) => from(data).pipe(
                mergeMap((each) => {

                    return this._getMediaContentById(String(each.mediaContentId)).pipe(
                        map(media => {
                            const result =  new LatestSubscriptionType()
                            result.mediaContent = media
                            result.totalSubscribedEpisodes = each.totalEpisodes
                            return result
                        })
                    )
                }),
                toArray(),
                map(zipped => {
                    const result = new PaginatedLatestSubscriptionType()
                    result.data = zipped
                    result.total = total
                    result.page = pagination.page
                    result.limit = pagination.limit
                    return result
                })
            )),

        )
    }

    private _resolveLocaleText(localeText: LocaleTextResponse, lang: keyof Locale) {
        return get(localeText, lang) ?? get(localeText, 'en', '')
    }

}
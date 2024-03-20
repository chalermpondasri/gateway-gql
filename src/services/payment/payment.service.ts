import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    catchError,
    map,
    mergeMap,
    Observable,
    of,
    tap,
} from 'rxjs'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { PaymentTransactionType } from '@/types/objects/payment.type'
import { RentalStatus } from '@/types/enums/rental-status.enum'
import { ICacheService } from '@/services/cache/interface/service.interface'
import { RequestContext } from '@/providers/request-context.provider'
import { MediaEpisodeType } from '@/types/objects'
import { SubscriptionResponse } from '@/repositories/payment/subscriptions.response'

export class PaymentService {
    public constructor(
        @Inject(ProviderName.PAYMENT_REPOSITORY)
        private readonly _paymentRepository: IPaymentRepository,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
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

    public getPaymentHistory(page: number, limit: number): Observable<PaymentTransactionType[]> {
        return this._paymentRepository.getPaymentHistory(page, limit).pipe(
            map(result => {
                return plainToInstance(Array<PaymentTransactionType>, instanceToPlain(result.data))
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
            map(({result, ep}) => {

                if(result.length !== 0 && result.some(v => v.episodeId === parent.id && v.mediaContentId === parent.mediaContentId)) {
                    return RentalStatus.SUBSCRIBED
                }

                return ep.rentalStatus
            }),
            tap(console.log)
        )
    }
}
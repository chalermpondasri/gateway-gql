import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    map,
    Observable,
} from 'rxjs'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { PaymentTransactionType } from '@/types/objects/payment.type'

export class PaymentService {
    public constructor(
        @Inject(ProviderName.PAYMENT_REPOSITORY)
        private readonly _paymentRepository: IPaymentRepository,
    ) {
    }

    public createPaymentTransaction(): Observable<string> {
        return this._paymentRepository.createPaymentToken().pipe(
            map( response => response.transactionToken)
        )
    }

    public checkoutCoinPackage(packageId: number, transactionToken: string): Observable<CheckoutPackageType> {
        return this._paymentRepository.checkoutPackage(packageId, transactionToken).pipe(
            map( data => plainToInstance(CheckoutPackageType, {packageId, total: data.total }))
        )
    }

    public getPaymentHistory(page: number, limit: number): Observable<PaymentTransactionType[]> {
        return this._paymentRepository.getPaymentHistory(page, limit).pipe(
            map(result => {
                return plainToInstance(Array<PaymentTransactionType>, instanceToPlain(result.data))
            })
        )
    }

    public rentContent(mediaId: number, episodeId: number): Observable<boolean> {
        return this._paymentRepository.rent(mediaId, episodeId).pipe(
            map(result => result.success)
        )
    }
}
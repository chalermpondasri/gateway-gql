import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    map,
    Observable,
} from 'rxjs'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import { plainToInstance } from 'class-transformer'

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
}
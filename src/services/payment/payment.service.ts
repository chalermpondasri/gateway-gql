import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    map,
    Observable,
} from 'rxjs'
import { Inject } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'

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
}
import { PaymentService } from '@/services/payment/payment.service'
import { Inject } from '@nestjs/common'
import {
    Mutation,
    Resolver,
} from '@nestjs/graphql'
import { Observable } from 'rxjs'

@Resolver()
export class PaymentResolver {
    public constructor(
        @Inject(PaymentService)
        private readonly _paymentService: PaymentService
    ) {
    }

    @Mutation(() => String)
    public createPaymentTransactionToken(): Observable<string> {
        return this._paymentService.createPaymentTransaction()
    }

}
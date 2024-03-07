import { PaymentService } from '@/services/payment/payment.service'
import { Inject } from '@nestjs/common'
import {
    Args,
    Mutation,
    Resolver,
} from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import { CheckoutPackageInput } from '@/types/inputs/checkout-package.input'

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

    @Mutation(() => CheckoutPackageType)
    public checkoutPackage(
        @Args(CheckoutPackageInput.name) input: CheckoutPackageInput,
    ) {
        return this._paymentService.checkoutCoinPackage(input.packageId, input.transactionToken)
    }

}
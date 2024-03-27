import { PaymentService } from '@/services/payment/payment.service'
import { Inject } from '@nestjs/common'
import {
    Args,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { CheckoutPackageType } from '@/types/objects/checkout-package.type'
import { CheckoutPackageInput } from '@/types/inputs/checkout-package.input'
import {
    PaginatedPaymentTransactionType,
    PaymentTransactionType,
} from '@/types/objects/payment.type'
import { PaginationInput } from '@/types/inputs/pagination.input'
import { PaginatedCoinConsumptionHistory } from '@/types/objects/coin-consumption-history.type'
import { PaginatedLatestSubscriptionType } from '@/types/objects/latest-subscription.type'

@Resolver(() => PaymentTransactionType)
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

    @Query(() => PaginatedPaymentTransactionType)
    public getPaymentHistory(
        @Args(PaginationInput.name, {nullable: true}) pagination?: PaginationInput
    ): Observable<PaginatedPaymentTransactionType> {

        return this._paymentService.getPaymentHistory(pagination.page,pagination.limit)
    }

    @Mutation(() => Boolean)
    public rentContent(
        @Args('contentId') contentId: number,
        @Args('episodeId') episodeId: number,
        ): Observable<boolean> {
        return this._paymentService.rentContent(contentId, episodeId)
    }

    @Query(() => PaginatedCoinConsumptionHistory)
    public getCoinConsumptionHistory(
        @Args(PaginationInput.name, {nullable: true}) pagination: PaginationInput
    ): Observable<PaginatedCoinConsumptionHistory>{
        return this._paymentService.coinConsumptionHistory(pagination.page, pagination.limit)
    }

    @Query(() => PaginatedLatestSubscriptionType)
    public latestSubscriptions(
        @Args(PaginationInput.name, {nullable: true}) pagination: PaginationInput
    ) {
        return this._paymentService.latestSubscriptions(pagination)
    }

}
import { Module } from '@nestjs/common'
import { paymentRepositoryProvider } from '@/providers/payment.provider'
import { PaymentService } from '@/services/payment/payment.service'
import { PaymentResolver } from '@/services/payment/payment.resolver'

@Module({
    providers: [
        paymentRepositoryProvider,
        PaymentService,
        PaymentResolver,
    ],
    exports: [
        paymentRepositoryProvider,
        PaymentService,
    ]
})
export class PaymentModule {}
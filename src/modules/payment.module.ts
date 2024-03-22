import { Module } from '@nestjs/common'
import { PaymentService } from '@/services/payment/payment.service'
import { PaymentResolver } from '@/services/payment/payment.resolver'

@Module({
    providers: [
        PaymentService,
        PaymentResolver,
    ],
    exports: [
        PaymentService,
    ]
})
export class PaymentModule {}
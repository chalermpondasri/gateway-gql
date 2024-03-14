import { Transform } from 'class-transformer'

export class PaymentResponse {
    public transactionId: string
    public total: number
    public coinGain: number
    public paymentStatus: string
    public paymentType: string
    @Transform(({value}) => !!value ? new Date(value) : null)
    public updatedAt: Date
}
import { Transform } from 'class-transformer'

export class PaymentResponse {
    public transactionId: string
    public total: number
    public coinGain: number
    public paymentStatus: string
    public paymentType: string
    public coinBonus: number
    @Transform(({value}) => !!value ? new Date(value) : null)
    public updatedAt: Date
}
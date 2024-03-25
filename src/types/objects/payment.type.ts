import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import { Paginated } from '@/types/objects/abstract.type'

@ObjectType()
export class PaymentTransactionType {
    @Field()
    public transactionId: string
    @Field()
    public total: number
    @Field()
    public coinGain: number
    @Field()
    public paymentStatus: string
    @Field()
    public paymentType: string
    @Field( () => GraphQLISODateTime)
    public updatedAt: Date


}

@ObjectType({})
export class PaginatedPaymentTransactionType extends Paginated(PaymentTransactionType) {

}
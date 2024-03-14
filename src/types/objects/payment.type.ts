import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'

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
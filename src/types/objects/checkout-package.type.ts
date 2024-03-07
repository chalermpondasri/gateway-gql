import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class CheckoutPackageType {
    @Field()
    public total: number
    @Field()
    public packageId: number
}
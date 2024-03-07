import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class CheckoutPackageInput {
    @Field(() => String)
    public transactionToken: string
    @Field(() => Number)
    public packageId: number
}
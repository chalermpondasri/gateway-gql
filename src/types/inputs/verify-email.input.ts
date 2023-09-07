import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class VerifyEmailInput {
    @Field()
    public email: string
    @Field()
    public token: string
}
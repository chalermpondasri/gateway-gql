import {
    Field,
    InputType
} from '@nestjs/graphql'

@InputType()
export class RequestOtpInput {
    @Field()
    public otpToken: string
    @Field()
    public phoneNumber: string
}
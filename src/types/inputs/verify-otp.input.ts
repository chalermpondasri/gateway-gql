import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class VerifyOtpInput {
    @Field()
    public otpToken: string
    @Field()
    public referenceNumber: string
    @Field()
    public confirmationCode: string
}
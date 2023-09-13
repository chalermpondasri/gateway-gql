import { 
    Field, 
    InputType, 
} from '@nestjs/graphql';

@InputType()
export class UserVerifyOtpInput {
    @Field({nullable: false})
    public token: string

    @Field({nullable: false})
    public referenceNumber: string

    @Field({nullable: false})
    public otpCode: string
}

@InputType()
export class UserChangePasswordInput {
    @Field({nullable: false})
    public oldPassword: string

    @Field({nullable: false})
    public newPassword: string
}
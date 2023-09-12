import { 
    Field, 
    InputType 
} from '@nestjs/graphql';

@InputType()
export class UserRequestOtpInput {
    @Field({nullable: false})
    public profileId: string

    @Field({nullable: false})
    public newPin: string
}
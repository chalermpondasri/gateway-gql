import { 
    Field, 
    InputType 
} from '@nestjs/graphql';

@InputType()
export class CreateProfilePinInput {
    @Field({nullable: false})
    public profileId: string

    @Field({nullable: false})
    public newPin: string
}

@InputType()
export class UpdateProfilePinInput extends CreateProfilePinInput {
    @Field({nullable: false})
    public oldPin: string
}

@InputType()
export class ValidateProfilePinInputType {
    @Field()
    public profileId: string

    @Field()
    public pin: string
}


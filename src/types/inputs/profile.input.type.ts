import { 
    Field, 
    InputType, 
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
@InputType()
export class CreateProfileInput {
    @Field()
    public name: string;

    @Field()
    public avatar: number;

    @Field()
    public dob: string;

    @Field({nullable: true})
    public pinCode?: string;

    @Field(()=> [String])
    public categories: string[];

    @Field()
    public isLimit: boolean;

    @Field()
    public contentRating: string;
}


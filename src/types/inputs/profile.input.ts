import { 
    Field, 
    InputType,  
} from '@nestjs/graphql';
import { ContentRating } from '../enums';

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

@InputType()
export class VerifyResetProfilePin extends CreateProfilePinInput {
    @Field()
    public token: string
}


@InputType()
export class UpdateProfileInput {
    @Field({nullable:true})
    public name: string;

    @Field({nullable:true})
    public avatar: number;

    @Field({nullable:true})
    public isLimit: boolean;

    @Field(()=> ContentRating, {nullable:true})
    public contentRating: ContentRating;
}

@InputType()
export class UpdateContinueWatchingInput{
    @Field()
    public profileId: string
    @Field()
    public mediaContentId: string
    @Field()
    public mediaEpisodeId: string
    @Field()
    public watchingAt: number
}

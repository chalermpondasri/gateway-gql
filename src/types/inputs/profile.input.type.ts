import { 
    Field, 
    InputType 
} from '@nestjs/graphql';

@InputType()
export class CreateProfilePinInput {
    @Field({nullable: false})
    public profileId: string

    @Field({nullable: false})
    public pin: string
}
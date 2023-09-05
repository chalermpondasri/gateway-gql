import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProfilePinInput {
    @Field({nullable: false})
    profileId: string

    @Field({nullable: false})
    pin: string
}
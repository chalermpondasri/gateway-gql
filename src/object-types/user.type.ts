import {
    Field,
    ID,
    InputType,
    ObjectType
} from '@nestjs/graphql'

@InputType()
export class CreateUserInputType {
    @Field({
        nullable: false,
    })
    public email: string

    @Field({
        nullable: false,
    })
    public password: string

    @Field()
    public dob: string

    @Field()
    public acceptTermId: string
}

@ObjectType()
export class CreateUserResponseType {
    @Field(() => ID)
    public userId: string

    @Field()
    public status: string

    @Field()
    public email: string

    @Field()
    public otpToken: string
}
import {
    Field,
    ID,
    ObjectType
} from '@nestjs/graphql'

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
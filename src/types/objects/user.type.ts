import {
    Field,
    ID,
    ObjectType
} from '@nestjs/graphql'

@ObjectType()
export class BaseUserType {
    @Field(() => ID)
    public userId: string

    @Field()
    public status: string
}

@ObjectType()
export class CreateUserResponseType extends BaseUserType{
    @Field()
    public email: string

    @Field()
    public otpToken: string
}
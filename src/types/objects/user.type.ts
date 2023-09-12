import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
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

@ObjectType()
export class UserType {
    @Field(() => ID)
    public id: string

    @Field()
    public email: string

    @Field()
    public status: string

    @Field()
    public dob: string
}

@ObjectType()
export class UserRequestOtpType {
    @Field()
    public referenceNumber: string

    @Field(type => Int)
    public remaining: number

    @Field(type => GraphQLISODateTime)
    public expiredAt: Date

    @Field()
    public token: string
}
import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
} from '@nestjs/graphql'
import {
    ProfileType,
} from '@/types/objects/profile.type'
import { IdStringType } from '@/types/objects/id-string.type'
import { DeviceSessionType } from '@/types/objects/device-session.type'

@ObjectType()
export class BaseUserType {
    @Field(() => ID)
    public userId: string

    @Field()
    public status: string
}

@ObjectType()
export class CreateUserResponseType extends BaseUserType {
    @Field()
    public email: string

    @Field()
    public otpToken: string
}

@ObjectType()
export class UserType extends IdStringType {
    @Field()
    public email: string

    @Field()
    public verifiedPhoneNumber: string

    @Field()
    public status: string

    @Field()
    public emailVerificationStatus: string

    @Field({deprecationReason: 'Moved to profile instead'})
    public dob: string

    @Field(() => [ProfileType])
    public profiles: [ProfileType]

    @Field(() => [DeviceSessionType])
    public deviceSessions: [DeviceSessionType]
}

@ObjectType()
export class UserRequestOtpType {
    @Field()
    public referenceNumber: string

    @Field(() => Int)
    public remaining: number

    @Field(() => GraphQLISODateTime)
    public expiredAt: Date

    @Field()
    public token: string
}

@ObjectType()
export class UserVerifyOtpType {
    @Field(() => Boolean)
    public status: boolean
}

@ObjectType()
export class UserRequestEmailType {
    @Field()
    public referenceNumber: string

    @Field(() => GraphQLISODateTime)
    public expiredAt: Date

    @Field()
    public token: string
}
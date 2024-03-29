import { BaseUserType } from '@/types/objects/user.type'

import {
    Field,
    GraphQLISODateTime,
    Int,
    ObjectType,
} from '@nestjs/graphql'
import { JwtTokenType } from '@/types/objects/token.type'


@ObjectType()
export class RequestOtpType {
    @Field()
    public referenceNumber: string
    @Field( () => Int)
    public remaining: number
    @Field(() => GraphQLISODateTime)
    public expiredAt: Date
}
@ObjectType()
export class VerifyOtpType extends BaseUserType {
    @Field(()=> JwtTokenType)
    public tokens: JwtTokenType
}
import { BaseUserType } from '@/types/objects/user.type'

import {
    Field,
    GraphQLISODateTime,
    Int,
    ObjectType,
} from '@nestjs/graphql'
import { TokenType } from './token.type'

@ObjectType()
export class RequestOtpType {
    @Field()
    public referenceNumber: string
    @Field( type => Int)
    public remaining: number
    @Field(type => GraphQLISODateTime)
    public expiredAt: Date
}
@ObjectType()
export class VerifyOtpType extends BaseUserType {
    @Field(()=> TokenType)
    public tokens: TokenType
}
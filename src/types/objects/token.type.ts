import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class TokenType {
    @Field()
    public accessToken: string
    @Field()
    public refreshToken: string
}
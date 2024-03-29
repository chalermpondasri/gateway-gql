import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class JwtTokenType {
    @Field()
    public accessToken: string
    @Field()
    public refreshToken: string
}

@ObjectType()
export class GenericTokenType {
    @Field()
    public token: string
}
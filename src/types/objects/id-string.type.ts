import {
    Field,
    ID,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class IdStringType {
    @Field(() => ID)
    public id: string
}
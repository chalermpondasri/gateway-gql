import {
    Field,
    ID,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class IdType {
    @Field(() => ID)
    public id: string
}
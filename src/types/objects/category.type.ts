import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class CategoryType {
    @Field()
    public id: string

    @Field()
    public label: string
}
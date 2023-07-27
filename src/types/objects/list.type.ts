import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType({isAbstract: true})
export abstract class ListType<T> {
    @Field()
    public total: number
    @Field()
    public page: number
    @Field()
    public limit: number

    abstract data: T[]
}
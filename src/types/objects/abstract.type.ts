import {
    Field,
    Int,
    ObjectType,
} from '@nestjs/graphql'
import { Type } from '@nestjs/common'

export interface IPaginatedType<T> {
    total: number
    limit: number
    page: number
    data: T[]
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {

    @ObjectType({ isAbstract: true })
    abstract class PaginatedType  implements IPaginatedType<T> {
        @Field(() => [classRef])
        public data: T[]
        @Field(() => Int)
        public limit: number
        @Field(() => Int)
        public page: number
        @Field(() => Int)
        public total: number
    }
    return PaginatedType as Type<IPaginatedType<T>>;
}
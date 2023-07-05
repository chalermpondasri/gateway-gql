import {
    Field,
    ID,
    ObjectType
} from '@nestjs/graphql'

@ObjectType()
export class TermType {
    @Field(() => ID)
    public id: number

    @Field()
    public en: string

    @Field()
    public th: string

    @Field()
    public createdAt: string

    @Field()
    public updatedAt: string

    @Field()
    public publishedAt: string
}
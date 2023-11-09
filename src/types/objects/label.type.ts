import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class LocalizedLabelType {
    @Field()
    public label: string
    @Field()
    public id: string
}
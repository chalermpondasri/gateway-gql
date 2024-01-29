import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class BytearkPlayerType {
    @Field()
    public signUrl: string
}
import { IdType } from '@/types/objects/cms.type'
import {
    Field,
    ObjectType,
} from '@nestjs/graphql'

@ObjectType()
export class SubjectType extends IdType {
    @Field()
    public subject: string
    @Field()
    public content: string
}
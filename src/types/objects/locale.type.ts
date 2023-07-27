import {
    Field,
    ID,
    ObjectType,
} from '@nestjs/graphql'
import { ListType } from '@/types/objects/list.type'


@ObjectType()
export class LabelType {
    @Field()
    public en: string

    @Field({nullable: true})
    public th: string

    @Field({nullable: true})
    public cn: string
}

@ObjectType()
export class LocaleType {
    @Field(() => ID)
    public id: string

    @Field()
    public key: string

    @Field( () => LabelType)
    public labels: LabelType
}

@ObjectType()
export class LocaleListType extends ListType<LocaleType>{
    @Field(() => [LocaleType])
    public data: LocaleType[]
}
import {
    Field,
    ObjectType,
} from '@nestjs/graphql'
import { CmsImageType } from '@/types/objects/cms.type'
import { LocalizedLabelType } from '@/types/objects/label.type'
import {
    MediaContentDetailType,
} from '@/types/objects/section.type'

@ObjectType()
export class PresetSearchType {
    @Field()
    public id: number
    @Field()
    public order: number

    @Field()
    public title: string

    @Field()
    public expanded: boolean

    @Field()
    public url: string

    @Field(() => CmsImageType)
    public coverImage: CmsImageType

    @Field(() => [LocalizedLabelType])
    public includeTags: LocalizedLabelType[]
    @Field(() => [LocalizedLabelType])
    public excludeTags: LocalizedLabelType[]

    @Field(() => [MediaContentDetailType])
    public contents: MediaContentDetailType[]

}
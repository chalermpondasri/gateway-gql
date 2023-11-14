import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import {
    CmsImageType,
    IdType,
} from '@/types/objects/cms.type'
import {
    LocalizedLabelType,
} from '@/types/objects/label.type'
import { CmsImageContent } from '@/repositories/cms'


@ObjectType()
export class ExternalContentType {
    @Field()
    public url: string
    @Field({nullable: true})
    public mimeType?: string
}

@ObjectType()
export class EpisodeItemType extends IdType {
    @Field()
    public order: number
    @Field({nullable: true})
    public duration: string
    @Field({nullable: true})
    public episodeName: string
    @Field(() => CmsImageType)
    public coverImage: CmsImageType
    @Field()
    public continueWatchingAt: number

}
@ObjectType()
export class SectionItemType extends IdType{
    @Field({nullable: true})
    public title: string
    @Field()
    public contentRating: string
    @Field(() => [ExternalContentType])
    public shortVideos: ExternalContentType[]
    @Field(() => [ExternalContentType])
    public trailers: ExternalContentType[]
    @Field(() => CmsImageType, {nullable: true})
    public coverImage: CmsImageType
    @Field(() => ExternalContentType, { nullable: true})
    public link: ExternalContentType
    @Field(() => [LocalizedLabelType])
    public tags: LocalizedLabelType[]
    @Field(() => [EpisodeItemType], { nullable: true})
    public episodes: EpisodeItemType[]
    @Field()
    public recentlyPublished: boolean
}

@ObjectType()
export class SectionType extends IdType {
    @Field()
    public sectionTitle: string
    @Field({nullable: true})
    public sectionSubtitle: string
    @Field()
    public sectionType: string
    @Field({nullable: true})
    public sectionLink: string
    @Field(() => GraphQLISODateTime)
    public createdAt: Date
    @Field(() => GraphQLISODateTime)
    public updatedAt: Date
    @Field()
    public order: number
    @Field(() => [SectionItemType])
    public sectionItems: SectionItemType[]
    @Field(() => CmsImageContent)
    public coverImage: CmsImageType



}
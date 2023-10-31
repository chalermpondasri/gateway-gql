import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import {
    CmsImageType,
    IdType,
} from '@/types/objects/cms.type'


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

}
@ObjectType()
export class SectionItemType extends IdType{
    @Field({nullable: true})
    public title: string
    @Field()
    public contentRating: string
    @Field(() => ExternalContentType)
    public shortVideo: ExternalContentType
    @Field(() => ExternalContentType)
    public trailer: ExternalContentType
    @Field(() => CmsImageType, {nullable: true})
    public coverImage: CmsImageType
    @Field(() => ExternalContentType, { nullable: true})
    public link: ExternalContentType
    @Field({ nullable: true})
    public tags: string
    @Field(() => EpisodeItemType, { nullable: true})
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



}
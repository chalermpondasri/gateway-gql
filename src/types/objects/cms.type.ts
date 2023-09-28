import {
    Field,
    ID,
    ObjectType,
} from '@nestjs/graphql'
@ObjectType()
export class CmsRoleType {
    @Field(() => ID)
    public id: number
    @Field()
    public name: string
    @Field()
    public description: string
    @Field()
    public type: string
}
@ObjectType()
export class CmsUserType {
    @Field(() => ID)
    public id: number
    @Field()
    public username: string
    @Field()
    public email: string
    @Field()
    public provider: string

    @Field(() => CmsRoleType)
    public role: CmsRoleType

    @Field()
    public jwt: string
}

@ObjectType({isAbstract: true})
export abstract class CmsDataType<T> {
    public data: T
}

@ObjectType({isAbstract: true})
export abstract class IdType {
    @Field(() => ID)
    public id: number
}
@ObjectType()
export class CmsImageType extends IdType {
    public name: string
    @Field()
    public width: number
    @Field()
    public height: number
    @Field()
    public hash: string
    @Field()
    public ext: string
    @Field()
    public mime: string
    @Field()
    public url: string
}

@ObjectType()
export class CmsPromotionalContentType extends IdType {
    @Field()
    public title: string
    @Field()
    public description: string
    @Field( () => CmsImageType)
    public imageWeb: CmsImageType
    @Field( () => CmsImageType)
    public imageMobile: CmsImageType
}

@ObjectType()
export class AvatarType extends IdType {
    @Field(()=> CmsImageType)
    public resourcePath: CmsImageType

    @Field()
    public color: string
}

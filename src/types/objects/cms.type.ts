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

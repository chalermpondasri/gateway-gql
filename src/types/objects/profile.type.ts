import { 
    Field, 
    ObjectType, 
} from '@nestjs/graphql';
import { IdStringType } from './id-string.type';
import { AvatarType } from './cms.type';
import { UserType } from './user.type';


@ObjectType()
export class BaseProfileType extends IdStringType  {
    @Field()
    public name: string
    @Field(()=> AvatarType)
    public avatar: AvatarType
    @Field()
    public audienceLevel: string
}

@ObjectType()
export class ProfileType extends BaseProfileType  {
    @Field()
    public dob: string
    @Field(()=> [String])
    public categories: string[]
    @Field()
    public contentRating: string
    @Field()
    public pinSettingStatus: string
    @Field(()=> UserType)
    public userAccount: UserType
}


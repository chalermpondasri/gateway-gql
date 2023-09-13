import { 
    Field, 
    ObjectType 
} from '@nestjs/graphql';
import { IdStringType } from './id-string.type';
import { 
    BaseProfileRespose, 
    ProfileRespose 
} from '@/repositories/auth';


@ObjectType()
export class BaseProfileType extends IdStringType implements BaseProfileRespose {
    @Field()
    public name: string
    @Field()
    public avatar: string
    @Field()
    public audienceLevel: string
}

@ObjectType()
export class ProfileType extends BaseProfileType implements ProfileRespose {
    @Field()
    public dob: string
    @Field(()=> [String])
    public categories: string[]
    @Field()
    public contentRating: string
}

@ObjectType()
export class ProfileHasAccountInformationType extends ProfileType {
    @Field()
    public email: string

    @Field()
    public phoneNumber: string
}
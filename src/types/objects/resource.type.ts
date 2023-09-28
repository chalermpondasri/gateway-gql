import { 
    Field, 
    ObjectType, 
} from "@nestjs/graphql";

@ObjectType()
export class ResourceType {
    @Field(()=> [String])
    public contentRating: string[]

    @Field(()=> [AvatarType])
    public avatars: AvatarType[]
}

@ObjectType()
export class AvatarType {
    @Field()
    public resourcePath: string

    @Field()
    public color: string
}
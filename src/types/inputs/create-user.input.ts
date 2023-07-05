import {
    Field,
    InputType
} from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
    @Field({
        nullable: false,
    })
    public email: string

    @Field({
        nullable: false,
    })
    public password: string

    @Field()
    public dob: string

    @Field()
    public acceptTermId: string
}
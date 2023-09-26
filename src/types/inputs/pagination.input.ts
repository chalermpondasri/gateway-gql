import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class PaginationInput {
    @Field({defaultValue: 20, nullable: true})
    public limit = 20

    @Field({defaultValue: 1, nullable: true})
    public page = 1
}
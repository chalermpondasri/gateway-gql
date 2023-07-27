import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class PaginationInput {
    @Field({defaultValue: 20})
    public limit: number

    @Field({defaultValue: 1})
    public page: 1
}
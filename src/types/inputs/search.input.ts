import { PaginationInput } from '@/types/inputs/pagination.input'
import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class SearchInput extends PaginationInput{
    @Field()
    public keyword: string
    @Field({nullable: true})
    public profileId: string
}
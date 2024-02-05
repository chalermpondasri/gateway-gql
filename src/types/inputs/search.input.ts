import { PaginationInput } from '@/types/inputs/pagination.input'
import {
    Field,
    InputType,
} from '@nestjs/graphql'

@InputType()
export class SearchInput extends PaginationInput{
    @Field()
    public query: string
}
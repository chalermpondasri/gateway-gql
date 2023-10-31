import { 
    Field, 
    InputType, 
} from '@nestjs/graphql';
import { PaginationInput } from './pagination.input';

@InputType()
export class NotificationInput extends PaginationInput {
    @Field({ nullable: true })
    public profileId: string
    @Field({ nullable: true })
    public isRead: boolean
}
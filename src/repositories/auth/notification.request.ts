import { PaginationRequest } from './common.model';

export class NotificationQueryRequest extends PaginationRequest {
    public profileId: string
    public isRead: boolean
}
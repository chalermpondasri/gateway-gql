import { PaginationRequest } from '../../models/common/common.model';

export class NotificationQueryRequest extends PaginationRequest {
    public profileId: string
    public isRead: boolean
}
import { 
    Field, 
    ObjectType 
} from '@nestjs/graphql'
import { ListType } from './list.type'
import { ProfileType } from './profile.type'

@ObjectType()
export class NotificationType {
    @Field()
    public notificationId: string
    @Field()
    public profileId: string
    @Field()
    public type: string
    @Field()
    public image: string
    @Field()
    public title: string
    @Field()
    public programName: string
    @Field()
    public isRead: boolean
    @Field()
    public url: string
    @Field()
    public timestamp: number
    @Field(() => ProfileType)
    public profile: ProfileType
}

@ObjectType()
export class NotificationListType extends ListType<NotificationType> {
    @Field(() => [NotificationType])
    public data: NotificationType[]
}

@ObjectType()
export class ReadAllNotificationType  {
    @Field()
    public status: boolean
}
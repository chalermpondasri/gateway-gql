import { Inject } from '@nestjs/common';
import { 
    Args,
    Mutation,
    Parent,
    Query, 
    ResolveField, 
    Resolver, 
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { 
    NotificationListType, 
    NotificationType, 
    ProfileType,
    ReadAllNotificationType, 
} from '@/types/objects';
import { NotificationInput } from '@/types/inputs';

@Resolver(()=> NotificationType)
export class NotificationResolver {
    public constructor(@Inject(AuthService) private readonly _authService: AuthService){}

    @Query(()=> NotificationListType)
    public getNotification(
        @Args(NotificationInput.name, {nullable: true}) pagination: NotificationInput,
    ){
        return this._authService.getNotification(pagination)
    }

    @ResolveField('profile',()=> ProfileType)
    public profile(
        @Parent() parent: NotificationType,
    ){
        return this._authService.getProfileInformation(parent.profileId)
    }

    @Mutation(() => ReadAllNotificationType)
    public markAllNotiAsRead(@Args('profileId', {nullable: true}) profileId: string){
        return this._authService.markAllNotiAsRead(profileId)
    }

    @Mutation(() => NotificationType)
    public markNotiAsRead(@Args('notificationId') notificationId: string){
        return this._authService.markNotiAsRead(notificationId)
    }

}
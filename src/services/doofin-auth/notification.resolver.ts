import { Inject } from '@nestjs/common';
import { 
    Args,
    Context,
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
        @Context() ctx: any,
    ){
        return this._authService.getProfileInformation(ctx.req.headers.authorization, parent.profileId)
    }
}
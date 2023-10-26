import { Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
    Args, 
    Context, 
    Parent, 
    Query, 
    ResolveField, 
    Resolver, 
} from '@nestjs/graphql';
import { MyListType, UserType } from '@/types/objects';

@Resolver(()=> MyListType)
export class MyListResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService
    ) {}
    
    @Query(()=> MyListType)
    public getMyList(@Args('profileId') profileId:string){
        return this._authService.getMyList(profileId)
    }

    @ResolveField('user',()=> UserType)
    public user(@Context() ctx: any){
        return this._authService.getUser(ctx.req.headers.authorization)
    }

    @ResolveField('profile')
    public profile(@Parent() parent: any, @Context() ctx: any){   
        return this._authService.getProfileInformation(ctx.req.headers.authorization,parent?.profileId)
    }

}

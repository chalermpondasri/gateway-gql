import { 
    BaseProfileType, 
    ProfileType 
} from '@/types/objects';
import { Inject } from '@nestjs/common';
import { 
    Args, 
    Context,
    Mutation, 
    Query, 
    Resolver 
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { 
    CreateProfilePinInput, 
    UpdateProfilePinInput 
} from '@/types/inputs';

@Resolver()
export class ProfileResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {
    }

    @Query(() => [BaseProfileType])
    public getProfiles(@Context() ctx: any){
        return this._authService.getProfiles(ctx.req.headers.authorization)
    }

    @Mutation(()=> ProfileType)
    public createProfilePin(
        @Context() ctx: any,
        @Args(CreateProfilePinInput.name) arg: CreateProfilePinInput
    ){  
        return this._authService.createProfilePin(ctx.req.headers.authorization, arg)
    }

    @Mutation(()=> ProfileType)
    public changeProfilePin(
        @Context() ctx: any,
        @Args(UpdateProfilePinInput.name) arg: UpdateProfilePinInput
    ){  
        return this._authService.changeProfilePin(ctx.req.headers.authorization, arg)
    }

}
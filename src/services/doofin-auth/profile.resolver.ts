import {
    AvatarType,
    ProfileRequestResetPinType,
    ProfileType,
    UserType,
    ValidateProfilePinType,
} from '@/types/objects'
import { Inject } from '@nestjs/common'
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { AuthService } from './auth.service'
import {
    CreateProfileInput,
    CreateProfilePinInput,
    UpdateProfilePinInput,
    ValidateProfilePinInputType,
} from '@/types/inputs'
import { CmsService } from '../doofin-cms/cms.service'
import { map } from 'rxjs'

@Resolver(() =>  ProfileType)
export class ProfileResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
        @Inject(CmsService) 
        private readonly _cmsService: CmsService,
    ) {
    }

    @Query(() => [ProfileType])
    public getProfiles(@Context() ctx: any) {
        return this._authService.getProfiles(ctx.req.headers.authorization)
    }

    @Mutation(() => ProfileType)
    public createProfilePin(
        @Context() ctx: any,
        @Args(CreateProfilePinInput.name) arg: CreateProfilePinInput,
    ) {
        return this._authService.createProfilePin(ctx.req.headers.authorization, arg)
    }

    @Mutation(() => ProfileType)
    public changeProfilePin(
        @Context() ctx: any,
        @Args(UpdateProfilePinInput.name) arg: UpdateProfilePinInput,
    ) {
        return this._authService.changeProfilePin(ctx.req.headers.authorization, arg)
    }

    @Query(() => ProfileType)
    public getProfileAndAccountInformation(
        @Context() ctx: any,
        @Args('profileId') profileId: string,
    ) {
        return this._authService.getProfileInformation(ctx.req.headers.authorization, profileId)
    }

    @ResolveField('avatar',() => AvatarType)
    public avatar(
        @Parent() parent: ProfileType,
       
    ) {
        return this._cmsService.getAvatars((parent.avatar as unknown as number)).pipe(
            map(res=> res[0] ?? {})
        )
    }

    @ResolveField('userAccount',() => UserType)
    public userAccount(@Context() ctx: any) {
       return this._authService.getUser(ctx.req.headers.authorization)
    }

    @Query(() => ValidateProfilePinType)
    public validateProfilePin(@Args(ValidateProfilePinInputType.name) arg: ValidateProfilePinInputType){
        return this._authService.validateProfilePin(arg.profileId, arg.pin)
    }

    @Mutation(()=> ProfileType)
    public createProfile(@Args(CreateProfileInput.name) body: CreateProfileInput){
        return this._authService.createProfile(body)
    }

    @Mutation(() => ProfileRequestResetPinType)
    public requestTokenToResetPin(
        @Args('profileId') profileId: string,
        @Args('password') password: string,
    ){
        return this._authService.requestTokenToResetPin(profileId, password)
    }
    
}
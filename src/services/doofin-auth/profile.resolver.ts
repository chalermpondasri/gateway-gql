import {
    AvatarType,
    CategoryType,
    MediaContentDetailType,
    MyListType,
    ProfileRequestResetPinType,
    ProfileType,
    UserType,
    ValidateProfilePinType,
} from '@/types/objects'
import {
    Inject,
    Res,
} from '@nestjs/common'
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
    UpdateContinueWatchingInput,
    UpdateProfileInput,
    UpdateProfilePinInput,
    ValidateProfilePinInputType,
    VerifyResetProfilePin,
} from '@/types/inputs'
import { CmsService } from '../doofin-cms/cms.service'
import { map, tap } from 'rxjs'

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
        @Args('profileId') profileId: string,
    ) {
        return this._authService.getProfileInformation(profileId)
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

    @Mutation(() => ProfileType)
    public verifyTokenToResetPin(@Args(VerifyResetProfilePin.name) input: VerifyResetProfilePin){
        return this._authService.verifyTokenToResetPin(input)
    }

    @ResolveField('myList',() => [MyListType])
    public myList(@Parent() parent: ProfileType, @Context() context: any) {
        context.req.profileId = parent.id
       return this._authService.getMyList(parent.id)
    }

    @Mutation(() => [MyListType])
    public addToMyList(
        @Args({name: 'profileId', nullable: true}) profileId: string,
        @Args('programId') programId: string,
    ){
        return this._authService.addToMyList(profileId, programId)
    }

    @Mutation(() => [MyListType])
    public removeFromMyList(
        @Args({name: 'profileId', nullable: true}) profileId: string,
        @Args('programId') programId: string,
    ){
        return this._authService.removeFromMyList(profileId, programId)
    }

    @Mutation(()=> ProfileType)
    public updateProfile(
        @Args({name: 'profileId', nullable: true}) profileId: string,
        @Args(UpdateProfileInput.name) input: UpdateProfileInput
    ){
        return this._authService.updateProfile(profileId, input)
    }

    @Mutation(()=>  ProfileRequestResetPinType)
    public requestTokenToResetPinByAdmin(
        @Args('profileId') profileId: string,
        @Args('adminPin') adminPin: string
    ){
        return this._authService.requestTokenToResetPinByAdmin(profileId, adminPin)
    }

    @ResolveField('categories',() => [CategoryType])
    public categories(@Parent() parent: ProfileType) {
       return this._authService.mapCategoryIdWithLabel((parent.categories as unknown as string[]))
    }

    @Mutation(()=>  String)
    public updateContinueWatching(
        @Args(UpdateContinueWatchingInput.name) input: UpdateContinueWatchingInput,
    ){
        return this._authService.updateContinueWatching(input)
    }

    @Mutation(()=> ProfileType)
    public switchProfile(
        @Args("profileId") profileId: string,
        @Res() context: any
    ){
        return this._authService.switchProfile(profileId).pipe(
            tap(result=> {

                context.res.cookie('profileId', result.id, {sameSite: 'none',secure: true})

            })
        )
    }

    @Query(() => [ MyListType ])
    public getMyFin(){
        return this._authService.getMyList()
    }
    
}

@Resolver(() =>  MyListType)
export class MyListResolver {
    public constructor(
        @Inject(CmsService) 
        private readonly _cmsService: CmsService,
    ) {}
    @ResolveField('mediaContent',() => MediaContentDetailType)
    public mediaContent(@Parent() parent: any) {  
       return this._cmsService.getMediaContentById(parent.programId)
    }
}
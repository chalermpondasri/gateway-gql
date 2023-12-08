import {
    DeviceSessionType,
    ProfileType,
    UserRequestEmailType,
    UserRequestOtpType,
    UserType,
    UserVerifyOtpType,
    UserWhoForgotPasswordType,
} from '@/types/objects'
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
import { Inject } from '@nestjs/common'
import {
    ContactSupportInput,
    UserChangePasswordInput,
    UserSettingInput,
    UserVerifyOtpInput,
} from '@/types/inputs'

@Resolver( () => UserType)
export class UserResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {}

    @Query(() => UserRequestOtpType)
    public requestToChangePhoneNumber(
        @Args('phoneNumber') phoneNumber: string,
        @Context() ctx: any,
    ) {
        return this._authService.requestToChangePhoneNumber(
            ctx.req.headers.authorization,
            phoneNumber,
        );
    }

    @Mutation(() => UserVerifyOtpType)
    public verifyToChangePhoneNumber(
        @Args(UserVerifyOtpInput.name) input: UserVerifyOtpInput,
        @Context() ctx: any,
    ) {
       return this._authService.verifyToChangePhoneNumber(
        ctx.req.headers.authorization,
        input,
       )
    }

    @Mutation(() => UserVerifyOtpType)
    public changePassword(
        @Args(UserChangePasswordInput.name) input: UserChangePasswordInput,
        @Context() ctx: any,
    ) {
        return this._authService.changePassword(
            ctx.req.headers.authorization,
            input,
        )
    }

    @Query(() => UserType)
    public getUser(
        @Context() ctx: any
    ) {
        return this._authService.getUser(ctx.req.headers.authorization)
    }

    @ResolveField('deviceSessions', () => [DeviceSessionType])
    public deviceSessions() {
        return this._authService.getUserSessions()
    }

    @ResolveField('profiles',() => [ProfileType])
    public profiles(
        @Parent() user: UserType,
        @Context() ctx,
    ) {

        return this._authService.getProfiles(ctx.req.headers.authorization)
    }

    @Mutation(() => UserRequestEmailType)
    public requestToChangeEmail(
        @Context() ctx: any,
        @Args('newEmail') newEmail: string,
    ){
        return this._authService.requestToChangeEmail(
            ctx.req.headers.authorization,
            newEmail,
        )
    }

    @Mutation(() => UserVerifyOtpType)
    public verifyToChangeEmail(
        @Args(UserVerifyOtpInput.name) input: UserVerifyOtpInput,
        @Context() ctx: any,
    ) {
       return this._authService.verifyToChangeEmail(
        ctx.req.headers.authorization,
        input,
       )
    }

    @Mutation(() => UserType)
    public updateUserSetting(
        @Args(UserSettingInput.name) input: UserSettingInput,
    ) {
        return this._authService.updateUserSetting(input)
    }

    @Mutation(() => UserVerifyOtpType)
    public sendTicketToSupport(
        @Args(ContactSupportInput.name) input: ContactSupportInput,
    ){ 
        return this._authService.sendTicketToSupport(input)
    }

    @Query(()=> UserWhoForgotPasswordType)
    public findUserWhoForgotPassword(
        @Args({name:'emailOrPhone', type: ()=> String}) emailOrPhone: string
    ){
        return this._authService.findUserWhoForgotPassword(emailOrPhone)
    }

    @Query(()=> UserWhoForgotPasswordType)
    public requestOtpToResetPassword(
        @Args({name:'emailOrPhone', type: ()=> String}) emailOrPhone: string
    ){
        return this._authService.findUserWhoForgotPassword(emailOrPhone)
    }

}
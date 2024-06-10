import {
    DeviceSessionType,
    ProfileType,
    TicketType,
    UserAvailabilityCheckType,
    UserRequestEmailType,
    UserRequestOtpType,
    UserType,
    UserVerifyOtpType,
    UserWhoForgotPasswordType,
    VerifyOtpToResetPasswordType,
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
    VerifyOtpInput,
} from '@/types/inputs'
import { PaginationInput } from '@/types/inputs/pagination.input'
import { PaymentService } from '@/services/payment/payment.service'
import { Observable } from 'rxjs'

@Resolver( () => UserType)
export class UserResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
        @Inject(PaymentService)
        private readonly _paymentService: PaymentService,
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

    @Mutation(() => TicketType)
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

    @Mutation(()=> UserRequestOtpType)
    public requestOtpToResetPassword(
        @Args({name:'userId', type: ()=> String}) userId: string,
        @Args({name:'sendVia', type: ()=> String , description: 'email | phone-number'}) sendVia: string,
    ){
        return this._authService.requestOtpToResetPassword(userId, sendVia)
    }

    @Mutation(()=> VerifyOtpToResetPasswordType)
    public verifyOtpToResetPassword(
        @Args(VerifyOtpInput.name) input: VerifyOtpInput,
    ){
        return this._authService.verifyOtpToResetPassword(input)
    }

    @Mutation(()=> UserVerifyOtpType)
    public resetPassword(
        @Args({name: 'resetPasswordToken', type:()=> String}) resetPasswordToken: string,
        @Args({name: 'newPassword', type:()=> String}) newPassword: string,
    ){
        return this._authService.resetPassword(resetPasswordToken, newPassword)
    }

    @Query(() => UserAvailabilityCheckType)
    public getUserAvailabilityCheck(): Observable<UserAvailabilityCheckType> {
        return this._authService.getUserAvailability()
    }


    @ResolveField()
    public paymentHistory(
        @Parent() parent: UserType,
        @Args(PaginationInput.name, {nullable: true}) pagination: PaginationInput,
    ) {
        return this._paymentService.getPaymentHistory(pagination.page, pagination.limit)
    }

}
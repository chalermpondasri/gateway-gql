import {
    ProfileType,
    UserRequestOtpType,
    UserType,
    UserVerifyOtpType,
} from '@/types/objects'
import {
    Args,
    Mutation,
    Query,
    Resolver,
    Context,
    ResolveField,
    Parent,
} from '@nestjs/graphql'
import { AuthService } from './auth.service';
import { Inject } from '@nestjs/common';
import { 
    UserChangePasswordInput, 
    UserVerifyOtpInput, 
} from '@/types/inputs';

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

    @ResolveField('profiles',() => [ProfileType])
    public profiles(
        @Parent() user: UserType,
        @Context() ctx,
    ) {

        return this._authService.getProfiles(ctx.req.headers.authorization)
    }

}
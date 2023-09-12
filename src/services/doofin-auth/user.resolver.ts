import { UserRequestOtpType, UserVerifyOtpType } from '@/types/objects';
import { 
    Args, 
    Mutation, 
    Query, 
    Resolver,
    Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Inject } from '@nestjs/common';
import { 
    UserChangePasswordInput, 
    UserVerifyOtpInput, 
} from '@/types/inputs';

@Resolver()
export class UserResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {}

    @Query(() => UserRequestOtpType)
    requestToChangePhoneNumber(
        @Args('phoneNumber') phoneNumber: string,
        @Context() ctx: any,
    ) {
        return this._authService.requestToChangePhoneNumber(
            ctx.req.headers.authorization,
            phoneNumber,
        );
    }

    @Mutation(() => UserVerifyOtpType)
    verifyToChangePhoneNumber(
        @Args(UserVerifyOtpInput.name) input: UserVerifyOtpInput,
        @Context() ctx: any,
    ) {
       return this._authService.verifyToChangePhoneNumber(
        ctx.req.headers.authorization,
        input,
       )
    }

    @Mutation(() => UserVerifyOtpType)
    changePassword(
        @Args(UserChangePasswordInput.name) input: UserChangePasswordInput,
        @Context() ctx: any,
    ) {
        return this._authService.changePassword(
            ctx.req.headers.authorization,
            input,
        )
    }
}
import {
    Args,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'

import { AuthService } from '@/services/doofin-auth/auth.service'
import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'

import {
    CreateUserResponseType,
    RequestOtpType,
    TokenType,
    UserType,
    VerifyOtpType,
} from '@/types/objects'

import {
    CreateUserInput,
    RequestOtpInput,
    VerifyEmailInput,
    VerifyOtpInput,
} from '@/types/inputs'

@Resolver(() => CreateUserResponseType)
export class AuthResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService
    ) {

    }

    @Mutation(() => CreateUserResponseType)
    public createUser(
        @Args(CreateUserInput.name) input: CreateUserInput,
    ): Observable<CreateUserResponseType> {
        return this._authService.createNewUser(input)
    }

    @Mutation(() => RequestOtpType)
    public requestOtp(
        @Args(RequestOtpInput.name) input: RequestOtpInput,
    ) {
        return this._authService.sendOtp(input)
    }

    @Mutation( () => VerifyOtpType)
    public verifyOtp(
        @Args(VerifyOtpInput.name) input: VerifyOtpInput
    ) {
        return this._authService.verifyOtp(input)
    }

    @Query(() => TokenType)
    public userLogin(
        @Args('identity')
        identity: string,
        @Args('password')
        password: string,
    ) {
        return this._authService.doLogin(identity, password)
    }

    @Mutation(() => UserType)
    public verifyEmail(
        @Args(VerifyEmailInput.name) input: VerifyEmailInput
    ) {
        return this._authService.verifyEmail(input)
    }
}
import {
    Args,
    Mutation,
    Resolver,
} from '@nestjs/graphql'

import { AuthService } from '@/services/doofin-auth/auth.service'
import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'

import {
    CategoryType,
    CreateUserResponseType,
    RequestOtpType,
    VerifyOtpType,
} from '@/types/objects'

import {
    CreateUserInput,
    RequestOtpInput,
    VerifyOtpInput,
} from '@/types/inputs'


@Resolver(of => CreateUserResponseType)
export class AuthResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService
    ) {

    }

    @Mutation(returns => CreateUserResponseType)
    public createUser(
        @Args('CreateUserInput') input: CreateUserInput,
    ): Observable<CreateUserResponseType> {
        return this._authService.createNewUser(input)
    }

    @Mutation(returns => RequestOtpType)
    public requestOtp(
        @Args(RequestOtpInput.name) input: RequestOtpInput,
    ) {
        return this._authService.sendOtp(input)
    }

    @Mutation( returns => VerifyOtpType)
    public verifyOtp(
        @Args(VerifyOtpInput.name) input: VerifyOtpInput
    ) {
        return this._authService.verifyOtp(input)
    }

    @Mutation(returns => CategoryType)
    public updateUserPreferences(
        @Args({name: 'categoryIds', type: () => [String]}) ids: string[]
    ){
        return this._authService.updateUserPreferences('mockupId', ids)
    }
}
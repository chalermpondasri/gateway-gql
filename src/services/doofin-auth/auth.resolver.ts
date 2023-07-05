import {
    Args,
    Mutation,
    Resolver
} from '@nestjs/graphql'

import { AuthService } from '@/services/doofin-auth/auth.service'
import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'
import {
    CreateUserResponseType,
    RequestOtpType
} from '@/types/objects'
import {
    CreateUserInput,
    RequestOtpInput
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
        @Args('CreateUserInput') request: CreateUserInput,
    ): Observable<CreateUserResponseType> {
        return this._authService.createNewUser(request)
    }

    @Mutation(returns => RequestOtpType)
    public requestOtp(
        @Args(RequestOtpInput.name) request: RequestOtpInput,
    ) {
        return this._authService.sendOtp(request)
    }
}
import {
    Args,
    Mutation,
    Resolver
} from '@nestjs/graphql'
import {
    CreateUserInputType,
    CreateUserResponseType
} from '@/object-types'
import { AuthService } from '@/services/doofin-auth/auth.service'
import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'

@Resolver(of => CreateUserResponseType)
export class AuthResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService
    ) {

    }

    @Mutation(returns => CreateUserResponseType)
    public createUser(
        @Args('CreateUserInputType') request: CreateUserInputType,
    ): Observable<CreateUserResponseType> {
        return this._authService.createNewUser(request)
    }
}
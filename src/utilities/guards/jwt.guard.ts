import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common'
import {
    catchError,
    map,
    Observable,
    of,
} from 'rxjs'
import { GqlExecutionContext } from '@nestjs/graphql'
import {
    get,
    isNil,
    split,
} from 'lodash'
import { ProviderName } from '@/constants/provider-name.const'
import { IAuthRepository } from '@/repositories/auth'

export class JwtGuard implements CanActivate {

    public constructor(
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepo: IAuthRepository
    ) {
    }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const req = ctx.getContext().req;
        const getAuthHeader = get(req, 'headers.authorization', '')
        const splitHeader = split(getAuthHeader, ' ')
        if(isNil(splitHeader[1])) {
            throw new UnauthorizedException(UnauthorizedException.name)
        }
        return this._authRepo.getProfiles(splitHeader[1]).pipe(
            map(() => {
                // resp.status
                return true
            }),
            catchError(err => {
                return of(false)
            })
        )

    }

}
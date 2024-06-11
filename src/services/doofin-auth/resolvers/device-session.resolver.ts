import {
    Args,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { DeviceSessionType } from '@/types/objects'
import { AuthService } from '@/services/doofin-auth'
import { Inject } from '@nestjs/common'
import { RequestContext } from '@/providers/request-context.provider'
import { ProviderName } from '@/constants/provider-name.const'

@Resolver(() => DeviceSessionType)
export class DeviceSessionResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
    ) {
    }

    @Mutation(() => [String])
    public revokeUserSessions() {
        return this._authService.revokeSessions()
    }

    @Mutation(() => DeviceSessionType)
    public revokeSession(
        @Args('sessionId') sessionId: string,
    ) {
        return this._authService.revokeSession(sessionId)
    }

    @Query(() => [DeviceSessionType])
    public getUserSessions() {
        return this._authService.getUserSessions(this._requestContext.deviceId)
    }
}
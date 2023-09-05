import { BaseProfileType, ProfileType } from "@/types/objects";
import { Inject } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class ProfileResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {
    }

    @Query(() => [BaseProfileType])
    getProfiles(@Context() ctx){
        return this._authService.getProfiles(ctx.req.headers['token'])
    }

}
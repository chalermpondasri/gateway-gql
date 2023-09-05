import { BaseProfileType, ProfileType } from "@/types/objects";
import { Inject } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { CreateProfilePinInput } from "@/types/inputs";

@Resolver()
export class ProfileResolver {
    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {
    }

    @Query(() => [BaseProfileType])
    getProfiles(@Context() ctx: any){
        return this._authService.getProfiles(ctx.req.headers['token'])
    }

    @Mutation(()=> ProfileType)
    createProfilePin(
        @Context() ctx: any,
        @Args(CreateProfilePinInput.name) arg: CreateProfilePinInput
    ){  
        return this._authService.createProfilePin(ctx.req.headers['token'], arg)
    }

    @Mutation(()=> ProfileType)
    changeProfilePin(
        @Context() ctx: any,
        @Args(CreateProfilePinInput.name) arg: CreateProfilePinInput
    ){  
        return this._authService.changeProfilePin(ctx.req.headers['token'], arg)
    }

}
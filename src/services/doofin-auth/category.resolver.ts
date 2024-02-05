import {
    Args,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { CategoryType } from '@/types/objects'
import { Inject } from '@nestjs/common'
import { AuthService } from '@/services/doofin-auth/auth.service'

@Resolver(() => CategoryType)
export class CategoryResolver {
    public constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
    ) {

    }

    @Mutation(() => [CategoryType])
    public updateProfilePreferences(
        @Args({name: 'categoryIds', type: () => [String]}) ids: string[],
        @Args({name: 'profileId', nullable: true}) profileId: string,
    ) {
        return this._authService.updateUserPreferences(profileId, ids)
    }

    @Query(() => [CategoryType])
    public getCategories () {
        return this._authService.getAllCategories()
    }

}
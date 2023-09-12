import { UserRequestOtpType } from '@/types/objects';
import { 
    Args, 
    Mutation, 
    Query, 
    Resolver,
    Context ,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Inject } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(AuthService)
    private readonly _authService: AuthService
  ) {}

  @Query(() => UserRequestOtpType)
  requestToChangePhoneNumber(
    @Args('phoneNumber') phoneNumber: string,
    @Context() ctx: any,
) {
    return this._authService.requestToChangePhoneNumber(ctx.req.headers.authorization, phoneNumber)
  }
}
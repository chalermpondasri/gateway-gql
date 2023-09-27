import { Inject } from "@nestjs/common";
import { 
  Query, 
  Resolver, 
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class ResourceResolver {
  public constructor(
    @Inject(AuthService) private readonly _authService: AuthService,
  ) {}

  @Query(() => [String])
  public getContentRating() {
    return this._authService.getContentRating();
  }
}

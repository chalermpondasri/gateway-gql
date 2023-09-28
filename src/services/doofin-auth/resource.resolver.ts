import { Inject } from "@nestjs/common";
import { 
  Args,
  Int,
  Query, 
  Resolver, 
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { 
  AvatarType, 
} from "@/types/objects";
import { CmsService } from "../doofin-cms/cms.service";

@Resolver()
export class ResourceResolver {
    public constructor(
      @Inject(AuthService) private readonly _authService: AuthService,
      @Inject(CmsService) private readonly _cmsService: CmsService,
    ) {}

    @Query(() => [String])
    public getContentRating() {
      return this._authService.getContentRating()
    }

    @Query(() => [AvatarType])
    public getAvatars(@Args('id', { type: () => Int, nullable: true }) id: number){
      return this._cmsService.getAvatars(id)
    }

}

import { Inject } from "@nestjs/common";
import { 
  Query, 
  ResolveField, 
  Resolver, 
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { 
  AvatarType, 
  ResourceType, 
} from "@/types/objects";
import { map } from "rxjs";
import { CmsService } from "../doofin-cms/cms.service";

@Resolver(()=> ResourceType)
export class ResourceResolver {
    public constructor(
      @Inject(AuthService) private readonly _authService: AuthService,
      @Inject(CmsService) private readonly _cmsService: CmsService,
    ) {}

    @Query(() => ResourceType)
    public getResource() {
      return this._authService.getContentRating().pipe(
        map(val=>{
          const res =  new ResourceType()
          res.contentRating = val
          return res
        })
      )
    }

    @ResolveField('avatars',()=> [AvatarType])
    public avatars(){
      return this._cmsService.getAvatars()
    }

}

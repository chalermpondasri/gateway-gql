import { Inject } from "@nestjs/common";
import { 
  Args,
  Int,
  Mutation,
  Query, 
  Resolver, 
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { 
  AvatarType, 
} from "@/types/objects";
import { CmsService } from "../doofin-cms/cms.service";
import { LocalizedLabelType } from "@/types/objects/label.type";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { from, map, mergeMap, toArray } from "rxjs";
import { ProviderName } from "@/constants/provider-name.const";
import { CacheService } from "../cache/cache.service";
import { ImgCache } from "../cache/interface/service.interface";
import { randomUUID } from 'crypto'
import { streamToBuffer } from "@/utilities/stream-to-buffer.util";

@Resolver()
export class ResourceResolver {
    public constructor(
      @Inject(AuthService) private readonly _authService: AuthService,
      @Inject(CmsService) private readonly _cmsService: CmsService,
      @Inject(ProviderName.CACHE_SERVICE)
      private readonly _cacheService: CacheService
    ) {}

    @Query(() => [String])
    public getContentRating() {
      return this._authService.getContentRating()
    }

    @Query(() => [AvatarType])
    public getAvatars(@Args('id', { type: () => Int, nullable: true }) id: number){
      return this._cmsService.getAvatars(id)
    }

    @Mutation(() => [LocalizedLabelType])
    public async uploadFiles(
        @Args({name:'files', type:()=> [GraphQLUpload]}) files: Promise<FileUpload>[],
    ){  
        return from(files).pipe(
          mergeMap(p=> from(p)),
          mergeMap(f=> {
            return from(from(streamToBuffer(f.createReadStream()))).pipe(
              map(b=>{
                const l = new LocalizedLabelType()
                const img: ImgCache = {
                  imgBaseSixtyFour: b.toString("base64"),
                  fileName: f.filename,
                  mimeType: f.mimetype
                }
                l.id = randomUUID()
                l.label = img.imgBaseSixtyFour
                this._cacheService.setCache(`IMG-${l.id}`,JSON.stringify(img), 300)
                return l
              })
            )
          }),
          toArray(),
          map((ls)=> ls)
        )
    }
 

}

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
import { extname } from "path"
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { from, map, mergeMap, toArray } from "rxjs";
import { randomUUID } from 'crypto'
import { streamToBuffer } from "@/utilities/stream-to-buffer.util";

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

    @Mutation(() => [String])
    public async uploadFiles(
        @Args({name:'files', type:()=> [GraphQLUpload]}) files: Promise<FileUpload>[],
    ){  
        return from(files).pipe(
          mergeMap(p=> from(p)),
          mergeMap(f=> {
            return from(from(streamToBuffer(f.createReadStream()))).pipe(
              map(()=>{
                //TODO upload to a storage 
                return `cloud-storage/images/${randomUUID()}${extname(f.filename)}`
              })
            )
          }),
          toArray(),
        )
    }
 

}

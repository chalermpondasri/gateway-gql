import { Inject } from "@nestjs/common";
import { 
    Query, 
    Resolver, 
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class ContentRatingResolver {
    constructor(@Inject(AuthService) private readonly _authService: AuthService,){}
    @Query(()=> [String])
    getContentRating(){
        return this._authService.getContentRating()
    }
}
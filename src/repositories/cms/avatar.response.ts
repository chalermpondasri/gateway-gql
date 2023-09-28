import { BaseResponse } from "./base.response"
import { CmsImageContent } from "./promotional.response"

export class AvatarResponse {
    public resourcePath: { data: BaseResponse<CmsImageContent>}
    public color: string
}
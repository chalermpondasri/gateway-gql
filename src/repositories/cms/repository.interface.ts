import {
    BaseResponse,
    TermResponse
} from '@/repositories/cms'
import { Observable } from 'rxjs'
import { IBaseRequest } from '@/repositories/cms/base.request'

export interface ICmsRepository {
    getTermsAndConditions(request: IBaseRequest): Observable<BaseResponse<TermResponse>>
}

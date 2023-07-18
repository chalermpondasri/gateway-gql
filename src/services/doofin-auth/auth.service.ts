import {
    Inject,
    Injectable,
    LoggerService,
} from '@nestjs/common'
import {
    CreateUserRequest,
    IAuthRepository,
} from '@/repositories/auth'
import { ProviderName } from '@/constants/provider-name.const'
import {
    from,
    map,
    mergeMap,
    Observable,
} from 'rxjs'
import {
    BaseUserType,
    CategoryType,
    CreateUserResponseType,
    RequestOtpType,
} from '@/types/objects'
import {
    CreateUserInput,
    RequestOtpInput,
    VerifyOtpInput,
} from '@/types/inputs'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'

@Injectable()
export class AuthService {
    private readonly _logger: LoggerService

    constructor(
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
    ) {
    }

    public createNewUser(request: CreateUserInput): Observable<CreateUserResponseType> {
        const payload: CreateUserRequest = new CreateUserRequest()
        payload.email = request.email
        payload.dob = request.dob
        payload.password = request.password
        payload.acceptTermId = request.acceptTermId
        return from(this._authRepository.createNewUser(payload)).pipe(
            map(result => {
                const response = new CreateUserResponseType()
                response.userId = result.userId
                response.email = result.email
                response.otpToken = result.otpToken
                response.status = result.status
                return response
            }),
        )
    }

    public sendOtp(request: RequestOtpInput): Observable<RequestOtpType> {
        return this._authRepository.requestOtp(request).pipe(
            map(data => {
                const typedResponse = new RequestOtpType()
                typedResponse.expiredAt = data.expiredAt
                typedResponse.referenceNumber = data.referenceNumber
                typedResponse.remaining = data.remaining
                return typedResponse
            }),
        )
    }

    public verifyOtp(request: VerifyOtpInput): Observable<BaseUserType> {
        return this._authRepository.verifyOtp(request).pipe(
            map(data => {
                const typedResponse = new BaseUserType()
                typedResponse.status = data.status
                typedResponse.userId = data.userId
                return typedResponse
            }),
        )
    }

    public updateUserPreferences(userId: string, preferences: string[]): Observable<CategoryType[]> {
        return this._authRepository.updateUserPreferences(userId, preferences).pipe(
            map(result => {
                return result.map(r => {
                    const c = new CategoryType()
                    c.id = r
                    return c
                })
            }),
        )
    }

    public getAllCategories(): Observable<CategoryType[]> {
        return this._authRepository.getCategories().pipe(
            map( response => {
                return plainToInstance(Array<CategoryType>,instanceToPlain(response.data))
            })
        )
    }

}
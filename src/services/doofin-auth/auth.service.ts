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
    concatMap,
    from,
    map,
    Observable,
    toArray,
} from 'rxjs'
import {
    BaseProfileType,
    BaseUserType,
    CategoryType,
    CreateUserResponseType,
    ProfileHasAccountInformationType,
    ProfileType,
    RequestOtpType,
    UserRequestOtpType,
    UserType,
    UserVerifyOtpType,
} from '@/types/objects'
import {
    CreateProfilePinInput,
    CreateUserInput,
    RequestOtpInput,
    VerifyEmailInput,
    UpdateProfilePinInput,
    VerifyOtpInput,
    UserVerifyOtpInput,
    UserChangePasswordInput,
} from '@/types/inputs'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { TokenType } from '@/types/objects/token.type'

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

    public doLogin(identity: string, password: string): Observable<TokenType> {
        return this._authRepository.login(identity,password).pipe(
            map( response => {
                return plainToInstance(TokenType, response)
            })
        )
    }

    public verifyEmail(request: VerifyEmailInput): Observable<UserType> {
        return this._authRepository.verifyEmail(request).pipe(
            map( response => {
                return plainToInstance(UserType, response)
            })
        )

    }

    private _extractJwt(token: string = ''){
        return token.substring(token.indexOf(' ')+1)
    }

    public getProfiles(token: string): Observable<BaseProfileType[]>{
        return this._authRepository.getProfiles(this._extractJwt(token)).pipe(
            map((profile) =>{    
                return plainToInstance(Array<BaseProfileType>, instanceToPlain(profile.data))
            }),
        )
    }

    public createProfilePin(token: string, arg: CreateProfilePinInput): Observable<ProfileType>{
        return this._authRepository.createProfilePin(this._extractJwt(token), arg).pipe(
            map(res =>{
                return plainToInstance(ProfileType, res)
            })
        )
    }

    public changeProfilePin(token: string, arg: UpdateProfilePinInput): Observable<ProfileType>{
        return this._authRepository.changeProfilePin(this._extractJwt(token), arg).pipe(
            map(res =>{
                return plainToInstance(ProfileType, res)
            })
        )
    }

    public doRefreshToken(refreshToken: string): Observable<TokenType>{
        return this._authRepository.refreshToken(this._extractJwt(refreshToken)).pipe(
            map(value =>{
                return plainToInstance(TokenType, value)
            })
        )
    }

    public requestToChangePhoneNumber(token: string, phoneNumber: string): Observable<UserRequestOtpType>{
        return this._authRepository
          .requestToChangePhoneNumber(this._extractJwt(token), phoneNumber)
          .pipe(map((res) => plainToInstance(UserRequestOtpType, res)));
    }

    public verifyToChangePhoneNumber(token: string, input: UserVerifyOtpInput): Observable<UserVerifyOtpType> {
        return this._authRepository
          .verifyToChangePhoneNumber(this._extractJwt(token), input)
          .pipe(map((res) => plainToInstance(UserVerifyOtpType, res)));
    }

    public changePassword(token: string, input: UserChangePasswordInput): Observable<UserVerifyOtpType> {
        return this._authRepository
          .changePassword(this._extractJwt(token), input)
          .pipe(map((res) => plainToInstance(UserVerifyOtpType, res)));
    }

    public getProfileAndAccountInformation(token: string, profileId: string): Observable<ProfileHasAccountInformationType>{
        return this._authRepository
          .getProfileAndAccountInformation(this._extractJwt(token), profileId)
          .pipe(
            map(data => plainToInstance(ProfileHasAccountInformationType, data))
          )
    }

}
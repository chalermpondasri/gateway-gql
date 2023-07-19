export class LoginResponse {
    public jwt: string
    public user: UserResponse
}

export class UserResponse {
    public id: number
    public username: string
    public email: string
    public provider: string
    public confirmed: boolean
    public blocked: boolean
    public createdAt: string
    public updatedAt: string
}

export class RoleResponse {
    public id: number
    public name: string
    public description: string
    public type: string
    public createdAt: string
    public updatedAt: string
}

export type UserRoleResponse = UserResponse & {role: RoleResponse}
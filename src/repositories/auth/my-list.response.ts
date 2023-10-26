import { Transform } from "class-transformer"

export class MyListResponse {
    public programId: string
    @Transform(({value})=> !!value? new Date(value): null)
    public addDate: string
    public userId: string
    public profileId: string
}
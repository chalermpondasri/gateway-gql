import { 
    Transform, 
    Type, 
} from 'class-transformer'

class SubListResponse {
    public programId: string
    @Transform(({value})=> !!value? new Date(value): null)
    public addDate: string
}
export class MyListResponse {
    public userId: string
    public profileId: string
    @Type(()=>SubListResponse)
    public subList: SubListResponse[]
}
import { Transform } from 'class-transformer'

export class SubscriptionResponse {
    public id: string
    public coinSpent: number
    public mediaContentId: number
    public episodeId: number
    @Transform(({value}) => new Date(value))
    public rentAt: Date
}
class SubFaqResponse {
    public id: number
    public seq: number
    public subjectEn: string
    public subjectTh: string
    public contentEn: string
    public contentTh: string
}
export class FaqResponse {
    public subjectEn: string
    public subjectTh: string
    public subFaq: SubFaqResponse[]
    
}
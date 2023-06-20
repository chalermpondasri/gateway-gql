export class TermResponse {
    public id: number
    public attributes: TermAttribute
}

class TermAttribute {
    public en: string
    public th: string
    public createdAt: string
    public updatedAt: string
    public publishedAt: string
}
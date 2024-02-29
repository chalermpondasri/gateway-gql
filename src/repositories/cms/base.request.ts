import * as querystring from 'querystring'

type SortDirection = 'asc' | 'desc'

type SortMeta = { [key: string]: SortDirection }
export interface IBaseRequest {
}
export class BaseRequest implements IBaseRequest {
    public sortMeta: SortMeta = {}
    public populate: string[] = ['*']
    public build(): string{
        const queryObject = Object.keys(this.sortMeta).reduce((result, key, index) => {
            result[`sort[${index}]`] = `${key}:${this.sortMeta[key]}`
            return result
        }, {})

        return querystring.stringify(Object.assign({populate: this.populate}, queryObject))
    }
}
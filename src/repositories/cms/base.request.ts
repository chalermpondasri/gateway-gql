
type SortDirection = 'asc' | 'desc'

type SortMeta = { [key: string]: SortDirection }
export interface IBaseRequest {
}
export class BaseRequest implements IBaseRequest {
    public sortMeta: SortMeta = {}
    public build(){
        const queryObject = Object.keys(this.sortMeta).reduce((result, key, index) => {
            result[`sort[${index}]`] = `${key}:${this.sortMeta[key]}`
            return result
        }, {})

        return queryObject
    }
}
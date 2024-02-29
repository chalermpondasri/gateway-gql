import { BaseRequest } from "../base.request"
import * as querystring from 'querystring'


describe('BaseRequest', () => {
    it('should return default query string', () => {
        const b = new BaseRequest()
        expect(b.build()).toEqual('populate=*')
    })

    it('should return selected populated field', () => {
        const b = new BaseRequest()
        b.populate = ['test','some','field']
        expect(b.build()).toEqual('populate=test&populate=some&populate=field')
    })

    it('should return populated field along with sort', () => {
        const b= new BaseRequest()
        b.populate =['test']
        b.sortMeta = {
            'price': 'asc'
        }

        expect(querystring.unescape(b.build())).toEqual('populate=test&sort[0]=price:asc')
    })
})
import {
    Args,
    Context,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { LocaleService } from '@/services/doofin-auth/locale.service'
import { IdType } from '@/types/objects/id.type'
import {
    CreateLocaleLabelInput,
    UpdateLocaleLabelInput,
} from '@/types/inputs'
import {
    LocaleListType,
    LocaleType,
    LocalizedKeyLabelType,
} from '@/types/objects'
import { PaginationInput } from '@/types/inputs/pagination.input'

@Resolver()
export class LocaleResolver {
    constructor(
        @Inject(LocaleService)
        private readonly _localeService: LocaleService
    ) {
    }

    @Mutation(() => IdType)
    public createLocale(
        @Args(CreateLocaleLabelInput.name) input: CreateLocaleLabelInput,
        @Context() ctx,
    ){
        return this._localeService.createNewLocale(input, ctx.req.headers.authorization)
    }
    @Mutation(() => LocaleType)
    public deleteLocale(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this._localeService.deleteLocale(id, ctx.req.headers.authorization)
    }

    @Mutation(() => LocaleType)
    public patchLocale(
        @Context() ctx,
        @Args('id') id: string,
        @Args('payload') payload: UpdateLocaleLabelInput,
    ) {
        return this._localeService.patchLocale(id, payload,ctx.req.headers.authorization)
    }

    @Query(() => LocaleType)
    public locale(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this._localeService.getLocale(id, ctx.req.headers.authorization)
    }

    @Query(() => LocaleListType)
    public locales(
        @Context() ctx,
        @Args(PaginationInput.name, {nullable: true}) pagination: PaginationInput = new PaginationInput(),
        @Args('query', {nullable: true}) query: string
    ) {
        return this._localeService.getLocales(query, pagination, ctx.req.headers.authorization)
    }

    @Query(() => [LocalizedKeyLabelType])
    public getLocaleByCode(
        @Args('localeKey') localeKey: string
    ) {
        return this._localeService.getLocalesByCode(localeKey)
    }

}
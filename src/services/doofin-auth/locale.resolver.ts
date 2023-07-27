import {
    Args,
    Context,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'
import {
    Inject,
} from '@nestjs/common'
import { LocaleService } from '@/services/doofin-auth/locale.service'
import { IdType } from '@/types/objects/id.type'
import { CreateLocaleLabelInput } from '@/types/inputs'
import { LocaleType } from '@/types/objects'

@Resolver()
export class LocaleResolver {
    constructor(
        @Inject(LocaleService)
        private readonly _localeService: LocaleService
    ) {
    }

    @Mutation(() => IdType)
    public CreateLocaleLabel(
        @Args(CreateLocaleLabelInput.name) input: CreateLocaleLabelInput,
        @Context() ctx,
    ){
        return this._localeService.createNewLocale(input, ctx.req.headers.authorization)
    }

    @Query(() => LocaleType)
    public Locale(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this._localeService.getLocale(id, ctx.req.headers.authorization)
    }
}
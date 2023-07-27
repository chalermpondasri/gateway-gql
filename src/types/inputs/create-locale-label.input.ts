import {
    Field,
    InputType,
} from '@nestjs/graphql'


@InputType({description: 'localization label detail'})
export class LabelInput {
    @Field({nullable: false})
    public en: string

    @Field({nullable: true})
    public th: string

    @Field({nullable: true})
    public cn: string
}

@InputType({description: 'Create system-wide localization'})
export class CreateLocaleLabelInput {
    @Field({ nullable: false})
    public key: string

    @Field(() => LabelInput, {nullable: false})
    public labels: LabelInput
}

@InputType()
export class UpdateLocaleLabelInput extends CreateLocaleLabelInput {

}
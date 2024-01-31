import { ProviderName } from "@/constants/provider-name.const";
import { ContentRatingValidation } from "@/types/enums";
import { ClassProvider } from "@nestjs/common";

export const contentRatingValidationProvider: ClassProvider = {
    provide: ProviderName.CONTENT_RATING_VALIDATION,
    useClass: ContentRatingValidation,
}
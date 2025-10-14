import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class GoogleOAuth2CallbackDTO {
  /**
   * A specfied error(presents and not empty) will cause a validation failure.
   */
  @IsOptional()
  @IsEmpty({ message: 'Callback returned with error: $value' })
  error?: string;

  @ValidateIf((dto: GoogleOAuth2CallbackDTO) => !dto.error)
  @IsNotEmpty({ message: 'Authorization Code not found.' })
  @IsString()
  code: string;

  @IsNotEmpty({ message: 'State not set.Possible CSRF Attack.' })
  @IsString()
  state: string;
}

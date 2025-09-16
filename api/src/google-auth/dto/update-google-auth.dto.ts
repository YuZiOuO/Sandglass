import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleAuthDto } from './create-google-auth.dto';

export class UpdateGoogleAuthDto extends PartialType(CreateGoogleAuthDto) {}

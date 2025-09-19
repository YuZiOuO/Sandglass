import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { CreateGoogleAuthDto } from './dto/create-google-auth.dto';
import { UpdateGoogleAuthDto } from './dto/update-google-auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post()
  async create(@Body() createGoogleAuthDto: CreateGoogleAuthDto) {
    const { accessToken, googleRefreshToken } = createGoogleAuthDto;
    try {
      const decodedAccessToken = await this.firebaseService.auth.verifyIdToken(
        accessToken,
        true,
      );
      await this.googleAuthService.create(
        decodedAccessToken.uid,
        googleRefreshToken,
      );
    } catch {
      return 'Error';
    }
    return 'OK';
  }

  @Get()
  findAll() {
    return this.googleAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleAuthService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoogleAuthDto: UpdateGoogleAuthDto,
  ) {
    return this.googleAuthService.update(+id, updateGoogleAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleAuthService.remove(+id);
  }
}

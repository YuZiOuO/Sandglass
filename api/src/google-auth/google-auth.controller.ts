import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { CreateGoogleAuthDto } from './dto/create-google-auth.dto';
import { UpdateGoogleAuthDto } from './dto/update-google-auth.dto';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  create(@Body() createGoogleAuthDto: CreateGoogleAuthDto) {
    return this.googleAuthService.create(createGoogleAuthDto);
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
  update(@Param('id') id: string, @Body() updateGoogleAuthDto: UpdateGoogleAuthDto) {
    return this.googleAuthService.update(+id, updateGoogleAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleAuthService.remove(+id);
  }
}

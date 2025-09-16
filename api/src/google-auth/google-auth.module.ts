import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleAuth } from './entities/google-auth.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports:[TypeOrmModule.forFeature([GoogleAuth]),FirebaseModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}

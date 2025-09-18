import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [FirebaseService],
  providers: [FirebaseService],
})
export class FirebaseModule {}

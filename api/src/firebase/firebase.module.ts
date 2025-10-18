import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGuard } from './authentication/authentication.guard';

@Module({
  imports: [ConfigModule],
  exports: [FirebaseService, AuthenticationGuard],
  providers: [FirebaseService, AuthenticationGuard],
})
export class FirebaseModule {}

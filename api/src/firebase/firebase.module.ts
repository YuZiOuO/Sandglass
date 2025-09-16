import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
    exports:[FirebaseService],
    providers: [FirebaseService]
})
export class FirebaseModule {}

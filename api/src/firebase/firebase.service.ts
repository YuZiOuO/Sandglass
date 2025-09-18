import { Injectable } from '@nestjs/common';
import { App, AppOptions, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService {
  private readonly config: AppOptions | undefined;

  private readonly app: App = initializeApp();

  get auth() {
    return getAuth(this.app);
  }

  get db() {
    return getFirestore(this.app);
  }
}

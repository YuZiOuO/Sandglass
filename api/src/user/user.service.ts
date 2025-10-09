import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserNotFoundException } from './user.exception';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async exists(uid: string) {
    try {
      await this.getUser(uid);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return false;
      }
      throw e;
    }
  }

  async getUser(uid: string) {
    try {
      return await this.firebaseService.auth.getUser(uid);
    } catch (e) {
      throw new UserNotFoundException(e as Error);
    }
  }
}

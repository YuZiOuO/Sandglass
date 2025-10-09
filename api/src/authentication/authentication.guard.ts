import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { InvalidTokenException } from './authentication.exception';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.headers.authorization;
    if (accessToken === undefined) {
      throw new UnauthorizedException();
    }

    try {
      const decodedIdToken = await this.firebaseService.auth.verifyIdToken(
        accessToken,
        true,
      );
      req['uid'] = decodedIdToken.uid;
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw new InvalidTokenException(e);
      }
      throw e;
    }
  }
}

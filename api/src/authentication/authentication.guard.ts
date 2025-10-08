import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.headers.authorization;
    if (accessToken === undefined) {
      throw new UnauthorizedException();
    }

    // try {
    const decodedIdToken =
      await this.firebaseService.auth.verifyIdToken(accessToken);
    // } catch (e) {
    //   throw e;
    // }

    req['uid'] = decodedIdToken.uid;

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { InvalidTokenException } from './authentication.exception';

/**
 * Use _UserId_ Decorator to get uid as controller parameters.
 * @example
 * //@Get()
 * //@UseGuard(AuthenticationGuard)
 * controller(@UserId() uid:string) { return ;}
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) {
      throw new UnauthorizedException();
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.substring('Bearer '.length).trim();

    try {
      const decodedIdToken = await this.firebaseService.auth.verifyIdToken(
        accessToken,
        true,
      );
      req['_uid'] = decodedIdToken.uid;
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw new InvalidTokenException(e);
      }
      throw e;
    }
  }
}

import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticationGuard(new FirebaseService())).toBeDefined();
  });

  it('should pass if given a valid token', () => {});

  it('should raise error when token is invalid in format', () => {});

  it('should decode,parse the uid and extracts it to the request header', () => {});
});

import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticationGuard(new FirebaseService())).toBeDefined();
  });

  // #1
  it('should raise error when token is invalid in format', () => {});

  // if #1:
  it('should decode,parse the uid and extracts it to the request header', () => {});
});

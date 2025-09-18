import { Injectable } from '@nestjs/common';
import { CreateGoogleAuthDto } from './dto/create-google-auth.dto';
import { UpdateGoogleAuthDto } from './dto/update-google-auth.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuth } from './entities/google-auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(GoogleAuth)
    private googleAuthRepo: Repository<GoogleAuth>,
  ) {}

  async create(createGoogleAuthDto: CreateGoogleAuthDto) {
    const { uid, googleRefreshToken } = createGoogleAuthDto;
    if (await this.googleAuthRepo.exists({ where: { uid } })) {
      return 'Link Already Exists';
    }

    this.googleAuthRepo.create({
      uid: uid,
      googleRefreshToken: googleRefreshToken,
    });
    return 'This action adds a new googleAuth';
  }

  findAll() {
    return `This action returns all googleAuth`;
  }

  findOne(uid: number) {
    return `This action returns a #${uid} googleAuth`;
  }

  update(uid: number, updateGoogleAuthDto: UpdateGoogleAuthDto) {
    return `This action updates a #${uid} googleAuth`;
  }

  remove(uid: number) {
    return `This action removes a #${uid} googleAuth`;
  }
}

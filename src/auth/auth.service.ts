import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload';
import { PasswordService } from 'src/password/password.service';
import { SuccessSignIn } from './interface/success-sign-in';
import { UserRepository } from '../users/user.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userRepository: UserRepository,
  ) {}
  async signIn(authDto: AuthDto): Promise<[string, SuccessSignIn]> {
    const { password, email } = authDto;
    const user = await this.userRepository.findByEmail(email);
  
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const samePass = this.passwordService.compare(password, user.password);
    if (!samePass) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const userAuthSuccess: SuccessSignIn = {
      username: user.username,
      userId: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign({
      user: user.id,
    } as JwtPayload);

    return [token, userAuthSuccess];
  }
}

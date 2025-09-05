import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    
    const exists = await this.userRepository.findByEmail(email);
    if (exists) { 
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await this.passwordService.hash(password);
    const user = await this.userRepository.createUser(username, email, hashedPassword);

    delete (user as Partial<User>).password;
    delete (user as Partial<User>).id;
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
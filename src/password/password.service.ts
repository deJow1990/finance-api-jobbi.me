import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import { PasswordRegex } from './regex';

@Injectable()
export class PasswordService {
  private readonly salts = 10;
  compare(data: string, password: string): boolean {
    const same = compareSync(data, password);
    return same;
  }
  hash(data: string): string {
    const hashed = hashSync(data, this.salts);
    return hashed;
  }
  generateRandom(): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    const length = 10;
    while (password.length < length || !PasswordRegex.test(password)) {
      const index = randomInt(0, charset.length);
      password += charset[index];
    }
    return password;
  }
}
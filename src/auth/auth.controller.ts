import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { Cookies } from 'src/common/enums/Cookies';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: ExpressResponse, 
  ): Promise<{ user: { userId: string; username: string; email: string } }> {
    const [token, user] = await this.authService.signIn(authDto);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(Cookies.AUTHORIZATION, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) res: ExpressResponse) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(Cookies.AUTHORIZATION, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
    return { ok: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@GetUserId() userId: string) {
    return { userId };
  }
}
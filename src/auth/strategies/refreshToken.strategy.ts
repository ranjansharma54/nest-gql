import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwtRefreshSecret,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const authorizationHeader = req.get('Authorization');
    
        if (!authorizationHeader) {
            throw new HttpException('Authorization header is missing', HttpStatus.UNAUTHORIZED);
        }
    
        const refreshToken = authorizationHeader.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}
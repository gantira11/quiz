import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';

export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload) {
        return {
            id: payload.id,
            firstname: payload.firstname,
            lastname: payload.lastname,
            username: payload.username,
            is_admin: payload.is_admin,
        };
    }
}
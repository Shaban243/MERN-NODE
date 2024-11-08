import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: '9pX%k/a}]',
        });
    }


    validate(payload: any) {
        console.log('Inside JWT Strategy Validate');
        console.log(payload);

        return { userId: payload.sub, username: payload.username, email: payload.email, address: payload.address, isActive: payload.isActive, role: payload.role };
    }

}
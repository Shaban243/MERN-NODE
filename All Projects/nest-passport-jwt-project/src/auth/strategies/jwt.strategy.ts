// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ExtractJwt } from 'passport-jwt';
// import { Strategy } from 'passport-jwt';
// import { User } from 'src/users/entities/user.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,
//   ) {

//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET_KEY,
//     });
//   }

//   async validate(payload: any) {
//     console.log('Inside JWT Strategy Validate');
//     console.log('JWT payload: ', payload);

//     const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
//     if (!user) {
//       console.log('User not found in the database!');
//       return null;
//     }

//     return {
//       userId: payload.id,
//       username: payload.name,
//       email: payload.email,
//       address: payload.address,
//       isActive: payload.isActive,
//       role: payload.role,
//     };

//   }


// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){}
   
    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.userRepository.singUp(authCredentialsDto);
    }
    async signIn(authCredentialsDto: AuthCredentialsDto){
        const username = await this.userRepository.ValidateUserPassword(authCredentialsDto);
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }
    }

}

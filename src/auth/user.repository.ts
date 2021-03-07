import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { throwError } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const { username, password}=  authCredentialsDto;

        const user = new User();
        user.username = username;
        user.password = password;

        try{
            await user.save();        
        
        }catch(error){
            if(error.code==='23505'){
                throw new ConflictException('Username already exists');
            }else{
                throw new InternalServerErrorException();
            }
        }
        
    }
}   
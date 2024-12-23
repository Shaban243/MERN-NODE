import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

export class CognitoService {
    private cognito: CognitoIdentityProviderClient;
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {
        this.cognito = new CognitoIdentityProviderClient({
            region: 'ap-south-1',
      
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
      
          });
    }
  
    async syncCognitoUser(cognitoUsername: string): Promise<User> {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID, 
        Username: cognitoUsername,
      };
  
      try {
        
        const command = new AdminGetUserCommand(params);
        const userResponse = await this.cognito.send(command);
  
       
        const userAttributes = userResponse.UserAttributes.reduce(
          (acc, attr) => ({ ...acc, [attr.Name]: attr.Value }),
          {},
        );
  
        const user = this.userRepository.create({
           id: userResponse.Username,
           ...CreateUserDto
          });
          

        return this.userRepository.save(user);
      } catch (error) {
        console.error('Error fetching user from Cognito:', error);
        throw error;
      }
    }
  }
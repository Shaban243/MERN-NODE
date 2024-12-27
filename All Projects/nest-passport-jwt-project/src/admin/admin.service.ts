
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ListUsersCommand,
  ListUsersCommandOutput,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Role } from 'src/auth/roles.enum';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { cognito } from 'config/aws.config';
import { error, log } from 'console';
import { create } from 'domain';
import { UsersService } from 'src/users/users.service';





@Injectable()
export class AdminService {
  private cognito: CognitoIdentityProviderClient;


  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

  ) {
    this.cognito = new CognitoIdentityProviderClient({
      region: 'ap-south-1',
    });

  }


  async registerAdmin(createAdminDto: CreateAdminDto): Promise<{ message: string, savedAdmin: any }> {
    const { name, email, password, address, isActive, role } = createAdminDto;

    try {

      if (![Role.SuperAdmin, Role.UserAssistantAdmin, Role.ProductAssistantAdmin].includes(role)) {
        throw new BadRequestException(
          'Role must be one of the following: Super-Admin, User-Assistant-Admin, Product-Assistant-Admin.'
        );
      }


      const existingAdmin = await this.adminRepository.findOne({
        where: { role },
      });

      if (existingAdmin) {
        throw new ConflictException(`A ${role} already exists and cannot be created again.`);
      }


      const signUpCommand = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'address', Value: address },
          { Name: 'custom:address', Value: address },
          { Name: 'custom:isActive', Value: isActive ? '1' : '0' },
          { Name: 'custom:role', Value: role },
        ],
      });

      await this.cognito.send(signUpCommand);


      const admin = this.adminRepository.create({
        ...createAdminDto
      });


      const saltRounds = 10;
      admin.password = await bcrypt.hash(password, saltRounds);

      const savedAdmin = await this.adminRepository.save(admin);


      return {
        message:
          'Admin registered successfully. Please check your email and verify your account!. The admin details are:',
        savedAdmin,
      };
    } catch (error) {
      console.error('Error registering admin:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error registering admin.');
    }
  }








  // Function for getting the role of an admin
  // async getCognitoUserByRole(role: Role) {
  //   try {

  //     if (!Object.values(Role).includes(role)) {
  //       throw new BadRequestException(`Invalid role: ${role}`);
  //     }

  //     const params = {
  //       UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //       CliendId: process.env.COGNITO_CLIENT_ID,
  //     };

  //     const result = await this.cognito.send(new ListUsersCommand(params));


  //     const usersWithRole = result.Users?.filter(user =>
  //       user.Attributes?.find(attr => attr.Name === 'custom:role' && attr.Value === role)
  //     );


  //     return usersWithRole.length > 0 ? usersWithRole : null;
  //   } catch (error) {
  //     console.error('Error fetching users by role:', error.message);
  //     throw new NotFoundException(`Users with role ${Role.User} not found` + error.message);
  //   }
  // }












  // Route for confirming the admin email
  async confirmEmail(email: string, confirmationCode: string): Promise<{ message: string }> {

    try {

      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,

      };

      const confirmSignUpCommand = new ConfirmSignUpCommand(params);

      await this.cognito.send(confirmSignUpCommand);

      return { message: 'Email confirmed successfully!' };

    } catch (error) {

      console.error('Error confirming email:', error);
      console.error('Detailed error:', JSON.stringify(error, null, 2));

      if (error.name === 'ExpiredCodeException') {
        throw new BadRequestException('The confirmation code has expired. Please request a new code!');

      } else if (error.name === 'CodeMismatchException') {
        throw new BadRequestException('The confirmation code is incorrect. Please check the code and try again.');
      }

      throw new InternalServerErrorException('Email confirmation failed due to an unexpected error.');
    }

  }











  // Get all admins
  async getAllAdmins(): Promise<Admin[]> {
    try {
      // const params = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      // };

      // const response: ListUsersCommandOutput = await this.cognito.send(new ListUsersCommand(params));


      // const admins: Admin[] = response.Users?.filter(user => {
      //   const role = user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value;
      //   return role === Role.UserAssistantAdmin || role === Role.ProductAssistantAdmin;
      // }).map(user => ({
      //   id: user.Username || '',
      //   name: user.Attributes?.find(attr => attr.Name === 'name')?.Value,
      //   email: user.Attributes?.find(attr => attr.Name === 'email')?.Value,
      //   password: user.Attributes?.find(attr => attr.Name === 'password')?.Value,
      //   address: user.Attributes?.find(attr => attr.Name === 'custom:address')?.Value || '',
      //   isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1' ? 1 : 0,
      //   role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value as Role,
      // })) || [];

      // console.log('Filtered Admins fetched from Cognito user pool:', admins);


      const adminData = await this.adminRepository.find({
        where: {
          role: In([Role.UserAssistantAdmin, Role.ProductAssistantAdmin]),
        },
      });

      if (!adminData || adminData.length === 0) {
        throw new NotFoundException('No admins record found!');
      }

      return adminData;
    } catch (error) {
      console.error('Error retrieving admins from Cognito:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('No admins record found!');
    }
  }











  // Get admin by ID
  async getAdminById(adminId: string): Promise<Partial<Admin>> {
    try {

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        throw new NotFoundException(`Admin with given id ${adminId} not found.`);
      }


      return admin;
    } catch (error) {
      console.error('Error retrieving admin:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve admin record.');
    }
  }








  // Update admin details
  async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto): Promise<Partial<{message: string, updatedAdmin: any}>> {

    try {

      const admin = await this.adminRepository.findOne({ where: { id: adminId}});

      if(!admin) {
        throw new NotFoundException(`Admin with given id ${adminId} not found`);
      }

      const result = await this.adminRepository.update(adminId, updateAdminDto);

      if(result.affected === 0) {
        throw new NotFoundException(`Admin with given id ${adminId} not found`)
      }

      const updatedAdmin = await this.adminRepository.findOne({ where: { id: adminId }});

      console.log(`Admin with given id ${adminId} updated Successfully!`);


      // const admin = await this.getAdminById(id);

      // if (!admin) {
      //   throw new NotFoundException(`Admin with given id ${id} not found`);
      // }

      // const userAttributes = [];

      // if (updateAdminDto.name) {
      //   userAttributes.push({ Name: 'name', Value: updateAdminDto.name });
      // }


      // if (updateAdminDto.email) {
      //   userAttributes.push({ Name: 'email', Value: updateAdminDto.email });
      //   userAttributes.push({ Name: 'email_verified', Value: 'true' });
      // }


      // if (updateAdminDto.role) {
      //   userAttributes.push({ Name: 'custom:role', Value: updateAdminDto.role });
      // }


      // if (updateAdminDto.address) {
      //   userAttributes.push({ Name: 'custom:address', Value: updateAdminDto.address });
      // }


      // if (updateAdminDto.isActive !== undefined) {
      //   userAttributes.push({
      //     Name: 'custom:isActive',
      //     Value: String(updateAdminDto.isActive ? '1' : '0'),
      //   });
      // }




      // if (userAttributes.length === 0) {
      //   throw new ConflictException('No attributes to update');
      // }


      // const params = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      //   Username: id,
      //   UserAttributes: userAttributes,
      // };


      // await this.cognito.send(new AdminUpdateUserAttributesCommand(params));

      // if (updateAdminDto.password) {
      //   await this.resetPassword(id, updateAdminDto.password);
      // }


      // const updatedAdmin = await this.getAdminById(id);
      return {
        message: 'Admin details updated successfuly! The updated admin details are: ',
        updatedAdmin
        // id: updatedAdmin.id,
        // name: updateAdminDto.name || updatedAdmin.name,
        // email: updateAdminDto.email || updatedAdmin.email,
        // address: updateAdminDto.address || updatedAdmin.address,
        // isActive: updateAdminDto.isActive !== undefined ? updateAdminDto.isActive : updatedAdmin.isActive,
        // role: updateAdminDto.role || updatedAdmin.role,
      }
    } catch (error) {
      console.error('Error updating user', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update admin attributes!');
    }
  }








  // Function for deleting a user by id
  async remove(adminId: string): Promise<{message: string, deletedAdmin: any}> {

    try {

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        throw new NotFoundException(`User with given userid ${adminId} not found!`);
      }

      const deletedAdmin = await this.adminRepository.remove(admin);
      console.log(`User with given id ${adminId} deleted successfully!`);

      return {
        message: 'User deleted successfully, The deleted user details are: ',
        deletedAdmin
      };

      // const params = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      //   Username: id,
      // };

      // await this.cognito.send(new AdminDeleteUserCommand(params));
      // console.log(`Admin with ID ${id} deleted from Cognito`);

    } catch (error) {
      console.error('Error deleting admin', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('No admin record found for deletion');
    }

  }







  // Function for resetting the admin's password
  // private async resetPassword(id: string, newPassword: string): Promise<void> {
  //   try {
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     const params = {
  //       UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //       Username: id,
  //       Password: hashedPassword,
  //       Permanent: true,
  //     };

  //     await this.cognito.send(new AdminSetUserPasswordCommand(params));
  //     console.log(`Password for user with id ${id} updated successfully`);

  //   } catch (error) {
  //     console.error('Error resetting password', error);
  //     throw new ConflictException('Failed to update password');
  //   }

  // }


}

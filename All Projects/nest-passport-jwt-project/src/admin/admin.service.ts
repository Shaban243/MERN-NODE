
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandOutput
} from '@aws-sdk/client-cognito-identity-provider';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Role } from 'src/auth/roles.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { cognito } from 'config/aws.config';
import { error, log } from 'console';





@Injectable()
export class AdminService {
  private cognito: CognitoIdentityProviderClient;


  constructor(
    // @InjectRepository(Admin)
    // private readonly adminRepository: Repository<Admin>,
  ) {
    this.cognito = new CognitoIdentityProviderClient({
      region: 'ap-south-1',
    });

  }


  // Create admin
  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {

    try {

      const existingAdmin = await this.getCognitoUserByRole(createAdminDto.role);


      if (
        (createAdminDto.role === Role.SuperAdmin || createAdminDto.role === Role.UserAssistantAdmin || createAdminDto.role === Role.ProductAssistantAdmin) &&
        existingAdmin
      ) {
        throw new ConflictException(`A ${createAdminDto.role} already exists and cannot be created again.`);
      }


      if (
        !createAdminDto.email ||
        !createAdminDto.password ||
        !createAdminDto.role
      ) {
        throw new BadRequestException(
          'Missing required fields: email, password, or role.',
        );

      }

      if (![Role.SuperAdmin, Role.UserAssistantAdmin, Role.ProductAssistantAdmin].includes(createAdminDto.role)) {
        throw new BadRequestException('Role must be one of the following: Super-Admin, User-Assistant-Admin, Product-Assistant-Admin.');
      }


      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: `admin-${Date.now()}`,
        TemporaryPassword: createAdminDto.password,
        UserAttributes: [
          { Name: 'name', Value: createAdminDto.name },
          { Name: 'email', Value: createAdminDto.email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'custom:address', Value: String(createAdminDto.address) },
          { Name: 'custom:isActive', Value: createAdminDto.isActive ? '1' : '0' },
          { Name: 'custom:role', Value: createAdminDto.role },
        ],
      };

      const createdAdmin = await this.cognito.send(
        new AdminCreateUserCommand(params));
      console.log('Admin successfully created:', createdAdmin);

      return {
        id: createdAdmin.User?.Username ?? '',
        name: createAdminDto.name,
        email: createAdminDto.email,
        role: createAdminDto.role,
        password: createAdminDto.password,
        address: createAdminDto.address ?? '',
        isActive: createAdminDto.isActive ?? true,
      };
    } catch (error) {
      console.error('Error creating admin:', error.message || error);
      throw new Error('Error creating admin: ' + error.message || error);
    }

  }








  // Function for getting the role of an admin
  async getCognitoUserByRole(role: Role) {
    try {
      console.log('Checking if a user with the role exists:', role);

      if (!Object.values(Role).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }

      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      };

      const result = await this.cognito.send(new ListUsersCommand(params));

      const usersWithRole = result.Users?.filter(user =>
        user.Attributes?.find(attr => attr.Name === 'custom:role' && attr.Value === role)
      );

      return usersWithRole.length > 0 ? usersWithRole : null;
    } catch (error) {
      console.error('Error fetching users by role:', error.message);
      throw new Error('Error fetching users by role: ' + error.message);
    }
  }









  // Get all admins
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      };


      const response: ListUsersCommandOutput = await this.cognito.send(new ListUsersCommand(params));

      const admins: Admin[] = response.Users?.filter(user => {
        const role = user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value;
        return role === Role.UserAssistantAdmin || role === Role.ProductAssistantAdmin;
      }).map(user => ({
        id: user.Username || '',
        name: user.Attributes?.find(attr => attr.Name === 'name')?.Value,
        email: user.Attributes?.find(attr => attr.Name === 'email')?.Value,
        address: user.Attributes?.find(attr => attr.Name === 'custom:address')?.Value || '',
        isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
        role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value as Role,
      })) || [];

      console.log('Admins fetched from congito user-pool :', admins);

      return admins;
    } catch (error) {
      console.error('Error retrieving admins from Cognito:', error);
      throw new Error('Failed to retrieve admins from Cognito');
    }
  }










  // Get admin by ID
  async getAdminById(id: string): Promise<Partial<Admin>> {

    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
      };

      const command = new AdminGetUserCommand(params);
      const response = await this.cognito.send(command);

      if (!response) {
        throw new NotFoundException(`Admin with given id ${id} not found`);
      }

      const role = response.UserAttributes?.find(attr => attr.Name === 'custom:role')?.Value as Role;


      if (role === Role.SuperAdmin) {
        throw new ForbiddenException('Access to super admin is not allowed!');
      }

      return {
        id: response.Username || '',
        name: response.UserAttributes?.find(attr => attr.Name === 'name')?.Value,
        email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value,
        address: response.UserAttributes?.find(attr => attr.Name === 'address')?.Value,
        isActive: response.UserAttributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
        role: response.UserAttributes?.find(attr => attr.Name === 'custom:role')?.Value as Role,
      };

    } catch (error) {
      console.error('Error retrieving admin from Cognito', error);
      throw new Error('Failed to retrieve admin from Cognito');
    }

  }








  // Update admin details
  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<Partial<Admin>> {

    try {
      const admin = await this.getAdminById(id);

      if (!admin) {
        throw new NotFoundException(`Admin with given id ${id} not found`);
      }

      const userAttributes = [];

      if (updateAdminDto.name) {
        userAttributes.push({ Name: 'name', Value: updateAdminDto.name });
      }


      if (updateAdminDto.email) {
        userAttributes.push({ Name: 'email', Value: updateAdminDto.email });
        userAttributes.push({ Name: 'email_verified', Value: 'true' });
      }


      if (updateAdminDto.role) {
        userAttributes.push({ Name: 'custom:role', Value: updateAdminDto.role });
      }


      if (updateAdminDto.address) {
        userAttributes.push({ Name: 'custom:address', Value: updateAdminDto.address });
      }


      if (updateAdminDto.isActive) {
        userAttributes.push({ Name: 'custom:isActive', Value: String(updateAdminDto.isActive) });
      }



      if (userAttributes.length === 0) {
        throw new ConflictException('No attributes to update');
      }


      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
        UserAttributes: userAttributes,
      };


      await this.cognito.send(new AdminUpdateUserAttributesCommand(params));

      if (updateAdminDto.password) {
        await this.resetPassword(id, updateAdminDto.password);
      }


      const updatedAdmin = await this.getAdminById(id);
      return {
        id: updatedAdmin.id,
        name: updateAdminDto.name || updatedAdmin.name,
        email: updateAdminDto.email || updatedAdmin.email,
        address: updateAdminDto.address || updatedAdmin.address,
        isActive: updateAdminDto.isActive !== undefined ? updateAdminDto.isActive : updatedAdmin.isActive,
        role: updateAdminDto.role || updatedAdmin.role,
      }
    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }
  }








  // Function for deleting a user by id
  async remove(id: string): Promise<void> {

    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
      };

      await this.cognito.send(new AdminDeleteUserCommand(params));
      console.log(`Admin with ID ${id} deleted from Cognito`);

    } catch (error) {
      console.error('Error deleting admin', error);
      throw error;
    }

  }







  // Function for resetting the user's password
  private async resetPassword(id: string, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
        Password: hashedPassword,
        Permanent: true,
      };

      await this.cognito.send(new AdminSetUserPasswordCommand(params));
      console.log(`Password for user with id ${id} updated successfully`);

    } catch (error) {
      console.error('Error resetting password', error);
      throw new ConflictException('Failed to update password');
    }

  }


}

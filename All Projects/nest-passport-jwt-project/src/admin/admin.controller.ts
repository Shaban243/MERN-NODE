import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { Admin } from './entities/admin.entity';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}





  // Route for creating an admin
  @Post('registerAdmin')
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Create a new admin (Super-Admin access only)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto)    {

    try {
      const createdAdmin = await this.adminService.registerAdmin(createAdminDto);
      return createdAdmin;
    } catch (error) {
      console.error('Error creating admin:', error.message);
      throw new InternalServerErrorException('Failed to create admin');
    }

  }






   // Route for confirming the admin email
    @Post('confirm-email/:email')
    @ApiOperation({ summary: 'Cofirming the admin email through email verification code' })
    @ApiParam({
      name: 'email',
      description: 'Confirm Admin email',
      type: String,
    })
  
    @ApiResponse({ status: 200, description: 'Admin email verified successfully' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
  
    async confirmEmail(
      @Param('email') email: string, 
      @Body() confirmEmailDto: ConfirmEmailDto) {
  
      try {
        const emailStatus = this.adminService.confirmEmail(email, confirmEmailDto.confirmationCode);
        return emailStatus;
        
      } catch (error) {
        console.error('Error confirming the admin email', error.message);
        throw new InternalServerErrorException('Error confirming the admin email');
      }
  
    }



  // Route for retrieving a list of all admins
  @Get('getAllAdmins')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Get all admins (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'All admins fetched successfully' })

  async getAllAdmins(@Req() req) {

    try {
      console.log({ admin: req.admin });
      return this.adminService.getAllAdmins();
    } catch (error) {
      console.error('Error retrieving admins:', error.message);
      throw error;
    }

  }








  // Route for retrieving an admin by id
  @Get('getAdminById/:username')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Get admin by username (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin fetched successfully' })

  async getAdminById(@Param('username') username: string) : Promise<Partial<Admin>>    {

    try {
      const admin : Partial<Admin> = await this.adminService.getAdminById(username);
      return admin;
    } catch (error) {
      console.error(`Error finding the user with id ${username}`, error.message);
      throw error;
    }

  }








  // Route for updating an admin by id
  @Put('updateAdmin/:username')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Update admin details (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiBody({ type: UpdateAdminDto })

  async updateAdmin(@Param('username') username: string, @Body() updateAdminDto: UpdateAdminDto)   {

    try {
      const updatedAdmin = await this.adminService.updateAdmin(username, updateAdminDto);
      return updatedAdmin;
    } catch (error) {
      console.error(`Error updating admin with id ${username}`, error.message);
      throw error;
    }

  }








  // Route for deleting an admin by id
  @Delete('deleteAdmin/:username')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Delete admin (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })

  async deleteAdmin(@Param('username') username: string) {

    try {
      const deletedAdmin = await this.adminService.remove(username);
      return deletedAdmin;
    } catch (error) {
      console.error(`Error deleting the admin with id ${username}`, error.message);
      throw error;
    }
    
  }


}
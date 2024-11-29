import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { Admin } from './entities/admin.entity';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}





  // Route for creating an admin
  @Post('createAdmin')
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Create a new admin (Super-Admin access only)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto)    {

    try {
      const createdAdmin = await this.adminService.createAdmin(createAdminDto);
      return createdAdmin;
    } catch (error) {
      console.error('Error creating admin:', error.message);
      throw new InternalServerErrorException('Failed to create admin');
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
  @Get('getAdminById/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Get admin by ID (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin fetched successfully' })

  async getAdminById(@Param('id') id: string) : Promise<Partial<Admin>>    {

    try {
      const admin : Partial<Admin> = await this.adminService.getAdminById(id);
      return admin;
    } catch (error) {
      console.error(`Error finding the user with id ${id}`, error.message);
      throw error;
    }

  }








  // Route for updating an admin by id
  @Put('updateAdmin/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Update admin details (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiBody({ type: UpdateAdminDto })

  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto)   {

    try {
      const updatedAdmin = await this.adminService.updateAdmin(id, updateAdminDto);
      return updatedAdmin;
    } catch (error) {
      console.error(`Error updating admin with id ${id}`, error.message);
      throw error;
    }

  }








  // Route for deleting an admin by id
  @Delete('deleteAdmin/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Delete admin (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })

  async deleteAdmin(@Param('id') id: string) {

    try {
      const deletedAdmin = await this.adminService.remove(id);
      return deletedAdmin;
    } catch (error) {
      console.error(`Error deleting the admin with id ${id}`, error.message);
      throw error;
    }
    
  }


}
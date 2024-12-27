import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, InternalServerErrorException, NotFoundException, HttpException, ConflictException, BadRequestException } from '@nestjs/common';
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
  constructor(private readonly adminService: AdminService) { }





  // Route for creating an admin
  @Post('registerAdmin')
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Create a new admin (Super-Admin access only)' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Role must be one of the following: Super-Admin, User-Assistant-Admin, Product-Assistant-Admin.',
        error: 'BadRequest'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Admin already exists',
    schema: {
      example: {
        statusCode: 409,
        message: `A ${Role} already exists and cannot be created again.`,
        error: 'Conflict'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {

    try {
      const createdAdmin = await this.adminService.registerAdmin(createAdminDto);
      return createdAdmin;
    } catch (error) {
      console.error('Error creating admin:', error.message);

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to register admin');
    }


  }






  // Route for confirming the admin email
  @Post('confirm-email')
  @ApiOperation({ summary: 'Cofirming the admin email through email verification code' })
  @ApiResponse({ status: 200, description: 'Admin email verified successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })

  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {

    try {
      const emailStatus = this.adminService.confirmEmail(
        confirmEmailDto.email,
        confirmEmailDto.confirmationCode
      );
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
  @ApiResponse({
    status: 404,
    description: 'Admins record not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admins record not found!',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieved admins record' })

  async getAllAdmins(@Req() req) {

    try {
      console.log({ admin: req.admin });
      return this.adminService.getAllAdmins();
    } catch (error) {
      console.error('Error retrieving admins:', error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('No admin record found!');
    }

  }








  // Route for retrieving an admin by id
  @Get('getAdminById/:adminId')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Get admin by adminId (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin fetched successfully' })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admin with given id not found',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve admin record' })
  async getAdminById(@Param('adminId') adminId: string): Promise<{ message: string; admin: Partial<Admin> }> {
    try {

      const admin = await this.adminService.getAdminById(adminId);

      return {
        message: 'Admin fetched successfully.',
        admin,  
      };
    } catch (error) {
      console.error(`Error finding the admin with id ${adminId}:`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve admin record.');
    }
  }









  // Route for updating an admin by id
  @Put('updateAdmin/:adminId')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Update admin details (Super-Admin access only)' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admin with given id not found',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to update Admin record' })

  async updateAdmin(@Param('adminId') adminId: string, @Body() updateAdminDto: UpdateAdminDto) {

    try {
      const updatedAdmin = await this.adminService.updateAdmin(adminId, updateAdminDto);
      return updatedAdmin;
    } catch (error) {
      console.error(`Error updating admin with id ${adminId}`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update admin attributes.');
    }

  }








  // Route for deleting an admin by id
  @Delete('deleteAdmin/:adminId')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin])
  @ApiOperation({ summary: 'Delete admin (Super-Admin access only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Admin with given id not found',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to delete admin' })

  async deleteAdmin(@Param('adminId') adminId: string) {

    try {
      const deletedAdmin = await this.adminService.remove(adminId);
      return deletedAdmin;
    } catch (error) {
      console.error(`Error deleting the admin with id ${adminId}`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }     
      
      throw new NotFoundException('No admin record found for deletion!');
    }

  }


}
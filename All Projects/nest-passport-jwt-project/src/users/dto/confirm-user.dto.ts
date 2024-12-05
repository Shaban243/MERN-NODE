import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ConfirmUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    },
  )
  newPassword: string;
}

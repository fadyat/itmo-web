import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  photo: string;

  @ApiProperty({
    description: 'user_id which is generated via supertokens',
  })
  @IsString()
  @IsNotEmpty()
  supertokensUserId: string;
}

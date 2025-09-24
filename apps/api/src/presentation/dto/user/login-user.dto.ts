import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  password!: string;
}
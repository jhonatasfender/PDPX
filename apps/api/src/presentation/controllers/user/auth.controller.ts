import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { RegisterUserDto } from "../../dto/user/register-user.dto";
import { LoginUserDto } from "../../dto/user/login-user.dto";
import { RefreshTokenDto } from "../../dto/user/refresh-token.dto";
import {
  AuthResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
  MeResponseDto,
  ErrorResponseDto,
  EmailNotConfirmedErrorDto,
  InvalidCredentialsErrorDto,
} from "../../dto/user/auth-response.dto";
import { RegisterUserUseCase } from "../../../application/user/use-cases/register-user.use-case";
import { LoginUserUseCase } from "../../../application/user/use-cases/login-user.use-case";
import { RefreshTokenUseCase } from "../../../application/user/use-cases/refresh-token.use-case";
import { LogoutUserUseCase } from "../../../application/user/use-cases/logout-user.use-case";
import { GetCurrentUserUseCase } from "../../../application/user/use-cases/get-current-user.use-case";
import { GetCurrentUserWithPublicDataUseCase } from "../../../application/user/use-cases/get-current-user-with-public-data.use-case";
import { UserMapper } from "../../mappers/user.mapper";
import { MissingTokenException } from "../../../domain/exceptions/user-exceptions";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  public constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly getCurrentUserWithPublicDataUseCase: GetCurrentUserWithPublicDataUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Registrar novo usuário",
    description:
      "Cria uma nova conta de usuário no sistema usando Supabase Auth",
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: "Usuário criado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou usuário já existe",
    type: ErrorResponseDto,
  })
  public async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    const result = await this.registerUserUseCase.execute(registerUserDto);
    return {
      message: "Usuário criado com sucesso",
      user: UserMapper.fromSupabase(result.user),
      session: result.session,
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Fazer login",
    description: "Autentica um usuário e retorna tokens de acesso",
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciais inválidas",
    type: InvalidCredentialsErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: "Email não confirmado",
    type: EmailNotConfirmedErrorDto,
  })
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    const result = await this.loginUserUseCase.execute(loginUserDto);
    return {
      message: "Login realizado com sucesso",
      user: UserMapper.fromSupabase(result.user),
      session: result.session,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Renovar token",
    description: "Renova o token de acesso usando o refresh token",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token renovado com sucesso",
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Refresh token inválido",
    type: ErrorResponseDto,
  })
  public async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshResponseDto> {
    const result = await this.refreshTokenUseCase.execute(refreshTokenDto);
    return {
      message: "Token renovado com sucesso",
      session: result.session,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Fazer logout",
    description: "Encerra a sessão do usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Logout realizado com sucesso",
    type: LogoutResponseDto,
  })
  public async logout(): Promise<LogoutResponseDto> {
    await this.logoutUserUseCase.execute({ token: "" });
    return {
      message: "Logout realizado com sucesso",
      success: true,
    };
  }

  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Obter usuário atual",
    description: "Retorna os dados do usuário autenticado",
  })
  @ApiResponse({
    status: 200,
    description: "Usuário atual obtido com sucesso",
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Token não fornecido ou inválido",
    type: ErrorResponseDto,
  })
  public async getCurrentUser(@Request() req: any): Promise<MeResponseDto> {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new MissingTokenException();
    }

    const result = await this.getCurrentUserWithPublicDataUseCase.execute({ token });
    return {
      message: "Usuário atual obtido com sucesso",
      user: UserMapper.fromSupabaseWithPublicData(result.user, result.publicUser),
    };
  }
}

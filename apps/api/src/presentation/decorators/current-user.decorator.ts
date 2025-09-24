import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface CurrentUserData {
  auth: {
    id: string;
    email: string;
    emailConfirmed: boolean;
    lastSignIn: Date | null;
    providers: string[];
  };
  custom: {
    id: string;
    role: string;
    authUserId: string;
  } | null;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();

    if (request.customUser) {
      return {
        auth: {
          id: request.user?.sub || request.user?.id,
          email: request.customUser.email,
          emailConfirmed: request.user?.email_confirmed_at ? true : false,
          lastSignIn: request.user?.last_sign_in_at,
          providers:
            request.user?.identities?.map((i: any) => i.provider) || [],
        },
        custom: {
          id: request.customUser.id,
          role: request.customUser.role,
          authUserId: request.customUser.auth_user_id,
        },
      };
    }

    return {
      auth: {
        id: request.user?.sub || request.user?.id,
        email: request.user?.email,
        emailConfirmed: request.user?.email_confirmed_at ? true : false,
        lastSignIn: request.user?.last_sign_in_at,
        providers: request.user?.identities?.map((i: any) => i.provider) || [],
      },
      custom: null,
    };
  },
);

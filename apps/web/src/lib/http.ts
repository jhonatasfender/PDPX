import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      const errorData = err.response.data as any;

      if (errorData?.error === "INVALID_CREDENTIALS") {
        const customError = new Error(
          errorData.message ||
            "Credenciais incorretas. Verifique seu email e senha e tente novamente.",
        );
        (customError as any).code = "INVALID_CREDENTIALS";
        (customError as any).status = 401;
        return Promise.reject(customError);
      }

      if (
        errorData?.error === "INVALID_TOKEN" ||
        errorData?.error === "TOKEN_EXPIRED"
      ) {
        const customError = new Error(
          errorData.message || "Sessão expirada. Faça login novamente.",
        );
        (customError as any).code = errorData.error;
        (customError as any).status = 401;
        return Promise.reject(customError);
      }

      if (errorData?.error === "MISSING_TOKEN") {
        const customError = new Error(
          errorData.message || "Token de acesso não fornecido.",
        );
        (customError as any).code = "MISSING_TOKEN";
        (customError as any).status = 401;
        return Promise.reject(customError);
      }
    }

    return Promise.reject(err);
  },
);

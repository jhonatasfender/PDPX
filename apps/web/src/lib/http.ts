import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response.data as any;

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
        if (typeof window === "undefined") {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            throw new Error("Refresh token não encontrado");
          }

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
          );

          const { session } = response.data;
          if (session) {
            localStorage.setItem("access_token", session.access_token);
            localStorage.setItem("refresh_token", session.refresh_token);

            originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
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

    return Promise.reject(error);
  },
);

import type { AxiosError, RawAxiosRequestHeaders } from "axios";
import axios from "axios";
import { store$ } from "./legendState";
const apiUrl = process.env.EXPO_PUBLIC_BASE_API;

const Axios = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

type UserSession = {
  id: string;
  name: string | null | undefined;
  username: string;
  role: string;
  // company: Array<Company>;
  role_id: number;
  token: string;
};

export async function headerAuth(
  session: Promise<{ user: UserSession } | null>,
): Promise<RawAxiosRequestHeaders> {
  const sesh = await session;
  return {
    Authorization: `Bearer ${sesh?.user.token}`,
  };
}

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: unknown = error.response.data.message;
    if (error.response.data.errors) {
      const errs = error.response.data.errors;

      error.message = Object.keys(errs)
        .slice(0, 1)
        .map((e) => {
          return errs[e].map((ee: any) => ee).join("\n");
        })
        .join("\n");
    } else if (typeof message === "string") {
      error.message = message;
    } else if (typeof message === "object") {
      error.message = Object.keys(message as any)
        // @ts-expect-error gapapa gan error
        .map((m: any) => message[m])
        .join("\n");
    }

    throw error;
  },
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: unknown = error.response.data.message;
    if (error.response.data.errors) {
      const errs = error.response.data.errors;

      error.message = Object.keys(errs)
        .slice(0, 1)
        .map((e) => {
          return errs[e].map((ee: any) => ee).join("\n");
        })
        .join("\n");
    } else if (typeof message === "string") {
      error.message = message;
    } else if (typeof message === "object") {
      error.message = Object.keys(message as any)
        // @ts-expect-error gapapa gan error
        .map((m: any) => message[m])
        .join("\n");
    }

    throw error;
  },
);

export const axiosError = (error: AxiosError) => {
  const { message, errors } = error.response?.data as {
    message: string;
    errors: any;
  };
  console.log(error);
  if (errors) {
    const errs = errors;
    error.message = Object.keys(errs)
      .slice(0, 1)
      .map((e) => {
        return errs[e].map((ee: any) => ee).join("\n");
      })
      .join("\n");
  } else if (typeof message === "string") {
    error.message = message;
  } else if (typeof message === "object") {
    error.message = Object.keys(message as any)
      .map((m: any) => message[m])
      .join("\n");
  }
};

const setAxiosAuth = (token: string) => {
  Axios.interceptors.request.use((req) => {
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  });
};

const resetAxiosAuth = () => {
  Axios.interceptors.request.clear();
};

export { Axios, axios, setAxiosAuth, resetAxiosAuth };

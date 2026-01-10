import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { env } from "@/lib/env"; // Mengambil URL yang sudah divalidasi di fase 1

// 1. Buat Instance Axios
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Otomatis sisipkan Token)
// Setiap kali Anda memanggil api.get(), fungsi ini jalan duluan
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Global Error Handling)
// Setiap kali backend membalas, fungsi ini cek error code-nya
api.interceptors.response.use(
  (response) => response, // Jika sukses, return apa adanya
  async (error: AxiosError) => {
    const status = error.response?.status;
const requestUrl = error.config?.url || "";
    // Handle 401 Unauthorized (Token Expired / Tidak Valid)
if (status === 401 && !requestUrl.includes("/login")) {      // Hapus token kotor
      Cookies.remove("accessToken");
      
      // Redirect ke login jika terjadi di browser
      if (typeof window !== "undefined") {
        // Kita gunakan window.location agar full reload (membersihkan state memory)
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
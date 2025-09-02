import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'



/**
 * Her çağrıda güncel baseURL ile axios instance döner
 */
function getApiInstance() {
  const api = axios.create({
    baseURL:  "https://api.airtable.com/v0/appkTtnhXACqj0kag",
    // İstersen timeout, headers vs. ekleyebilirsin
  })

  // Response interceptor: Hata yönetimi
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
      // Burada genel hata yönetimi yapabilirsin
      return Promise.reject(error)
    }
  );

  api.interceptors.request.use(
    (config) => {
        // Token varsa header'a ekle
        const token = 'patZ8XD7iLvjw3hiW.0fe3bd729fe1f4b9a30c630b89f91dab7cfce4e4db90eadf616d8a4d860a66ec';
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
  return api
}

/**
 * Genel amaçlı API fonksiyonu
 * @param method - 'get', 'post', 'put', 'delete' vs.
 * @param url - API endpoint (örn: '/users')
 * @param data - (Opsiyonel) POST/PUT için body
 * @param config - (Opsiyonel) Axios config
 * @returns AxiosResponse
 */
export async function apiRequest<T = any>(
  method: AxiosRequestConfig['method'],
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const api = getApiInstance()
  return api.request<T>({
    method,
    url,
    data,
    ...config,
  })
}

export const apiService = getApiInstance()
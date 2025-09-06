import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'



/**
 * Returns axios instance with current baseURL on each call
 */
function getApiInstance() {
  const api = axios.create({
    baseURL:  "https://api.airtable.com/v0/appkTtnhXACqj0kag",
    // You can add timeout, headers, etc. if needed
  })

  // Response interceptor: Error handling
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
      // You can implement general error handling here
      return Promise.reject(error)
    }
  );

  api.interceptors.request.use(
    (config) => {
        // Add token to header if available
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
 * General purpose API function
 * @param method - 'get', 'post', 'put', 'delete', etc.
 * @param url - API endpoint (e.g., '/users')
 * @param data - (Optional) Body for POST/PUT requests
 * @param config - (Optional) Axios config
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
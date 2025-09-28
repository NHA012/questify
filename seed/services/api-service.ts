import axios from 'axios';
import https from 'https';

// Using a class to encapsulate the API functionality
class ApiService {
  private api;
  private cookies = '';

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor to capture cookies
    this.api.interceptors.response.use((response) => {
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        this.cookies = Array.isArray(setCookieHeader)
          ? setCookieHeader.join('; ')
          : setCookieHeader;
      }
      return response;
    });

    // Request interceptor to attach cookies
    this.api.interceptors.request.use((config) => {
      if (this.cookies) {
        config.headers.Cookie = this.cookies;
      }
      return config;
    });
  }

  // Method to clear cookies (useful for logout)
  clearCookies() {
    this.cookies = '';
  }

  // Expose the API instance with all HTTP methods
  get instance() {
    return this.api;
  }
}

// Create and export a default instance
const apiService = new ApiService('https://questify.dev');
export default apiService;

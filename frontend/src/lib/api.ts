import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  ApiError, 
  Event, 
  User, 
  DisabilityCard, 
  Companion,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Locale
} from '@/types';

const API_BASE = 'http://localhost:1337';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('JWT sent with request:', token);
      } else {
        console.log('No JWT found for request:', config.url);
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token);
      console.log('JWT Token:', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post(`${API_BASE}/api/auth/local`, credentials);
    this.setToken(response.data.jwt);
    const { user, jwt } = response.data;
    localStorage.setItem('userId', user.id.toString());
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post(`${API_BASE}/api/auth/local/register`, userData);
    this.setToken(response.data.jwt);
    const { user, jwt } = response.data;
    localStorage.setItem('userId', user.id.toString());
    return response.data;
  }

  async logout(): Promise<void> {
    this.removeToken();
    localStorage.removeItem('userId');
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get(`${API_BASE}/api/users/${userId}?populate=disability_card`);
    return response.data.data;
  }

  // Events
  async getEvents(locale: Locale = 'en'): Promise<Event[]> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.client.get(
      `${API_BASE}/api/events?locale=${locale}&populate=*&sort=createdAt:desc`
    );
    return response.data.data;
  }

  async getEvent(id: number, locale: Locale = 'en'): Promise<Event> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.client.get(
      `${API_BASE}/api/events/${id}?locale=${locale}&populate=*`
    );
    return response.data.data;
  }

  // Disability Cards
  /**
   * Fetch the disability card for the currently logged-in user only.
   * Strapi only allows /me for user-specific data.
   */
  async getDisabilityCard(): Promise<DisabilityCard | null> {
    try {
      // Use the custom /me endpoint that returns the user's disability card
      const response: AxiosResponse<ApiResponse<DisabilityCard>> = await this.client.get(
        `${API_BASE}/api/disability-cards/me`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return null; // No disability card exists - normal empty state
    } catch (error) {
      console.error('Error fetching disability card:', error);
      return null;
    }
  }

  async createDisabilityCard(formData: FormData): Promise<DisabilityCard> {
    const response: AxiosResponse<ApiResponse<DisabilityCard>> = await this.client.post(
      `${API_BASE}/api/disability-cards`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  async updateDisabilityCard(id: number, formData: FormData): Promise<DisabilityCard> {
    const response: AxiosResponse<ApiResponse<DisabilityCard>> = await this.client.put(
      `${API_BASE}/api/disability-cards/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  // Companions
  /**
   * Fetch all companions for the currently logged-in user only.
   * Strapi only allows /me for user-specific data.
   */
  async getCompanions(): Promise<Companion[]> {
    try {
      const response: AxiosResponse<ApiResponse<Companion[]>> = await this.client.get(
        `${API_BASE}/api/companions/me`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching companions:', error);
      return [];
    }
  }

  async createCompanion(companionData: { firstName: string; lastName: string }): Promise<Companion> {
    const response: AxiosResponse<ApiResponse<Companion>> = await this.client.post(
      `${API_BASE}/api/companions`,
      { 
        data: companionData
      }
    );
    return response.data.data;
  }

  async updateCompanion(id: number, companionData: { firstName: string; lastName: string }): Promise<Companion> {
    const response: AxiosResponse<ApiResponse<Companion>> = await this.client.put(
      `${API_BASE}/api/companions/${id}`,
      { data: companionData }
    );
    return response.data.data;
  }

  async deleteCompanion(id: number): Promise<void> {
    await this.client.delete(`${API_BASE}/api/companions/${id}`);
  }

  // File upload
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('files', file);

    const response: AxiosResponse<any> = await this.client.post(`${API_BASE}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data[0];
  }
}

export const apiClient = new ApiClient();
export default apiClient; 
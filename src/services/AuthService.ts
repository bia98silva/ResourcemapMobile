import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'http://10.0.2.2:5289/api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  isActive: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  organizationId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role: string;
  organizationId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  private api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
 
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

   
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        '/Auth/login',
        credentials
      );
      
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erro ao fazer login'
      );
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        '/Auth/register',
        userData
      );
      
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no registro:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erro ao fazer registro'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await this.api.get('/Auth/me');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter usuário atual:', error.response?.data || error.message);
      return null;
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<boolean> {
    try {
      await this.api.post('/Auth/change-password', passwordData);
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erro ao alterar senha'
      );
    }
  }

  async deleteAccount(password: string): Promise<boolean> {
    try {
      await this.api.delete('/Auth/delete-account', {
        data: { password }
      });
      
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar conta:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erro ao deletar conta'
      );
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.api.post('/Auth/validate-token', { token });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.api.get('/Test/public');
      return response.status === 200;
    } catch (error) {
      console.error('Erro de conectividade:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
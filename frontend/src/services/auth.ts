import api from './api';
import { type User } from '../types';

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const loginUser = async (credentials: Record<string, string>): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

// Add this below your existing loginUser function
export const registerUser = async (userData: Record<string, string>): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/register', userData);
  return response.data;
};
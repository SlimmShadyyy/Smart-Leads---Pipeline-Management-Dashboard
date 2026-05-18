import api from './api';
import { type Lead, type PaginatedResponse } from '../types';

// Fetch leads with advanced filtering and pagination
export const getLeads = async (params: {
  page?: number;
  search?: string;
  status?: string;
  source?: string;
  sortBy?: string;
}) => {
  const response = await api.get<PaginatedResponse<Lead>>('/leads', { params });
  return response.data;
};

// Create a new lead
export const createLead = async (leadData: Partial<Lead>) => {
  const response = await api.post<Lead>('/leads', leadData);
  return response.data;
};

// Update an existing lead
export const updateLead = async (id: string, leadData: Partial<Lead>) => {
  const response = await api.put<Lead>(`/leads/${id}`, leadData);
  return response.data;
};

// Delete a lead
export const deleteLead = async (id: string) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};
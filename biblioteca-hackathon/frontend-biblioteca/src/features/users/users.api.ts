import { apiClient } from '../../shared/api/apiClient';
import { User } from '../../types/domain';

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get('/users');
  return data;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post('/users', payload);
  return data;
}

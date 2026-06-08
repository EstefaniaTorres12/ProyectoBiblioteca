import { apiClient } from '../../shared/api/apiClient';
import { User } from '../../types/domain';

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get('/users');
  return data;
}

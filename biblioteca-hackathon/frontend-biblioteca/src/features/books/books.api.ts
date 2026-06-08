import { apiClient } from '../../shared/api/apiClient';
import { Book } from '../../types/domain';

export async function getBooks(search?: string): Promise<Book[]> {
  const { data } = await apiClient.get('/books', { params: { search } });
  return data;
}

export async function createBook(payload: Omit<Book, 'id' | 'availableQuantity'>): Promise<Book> {
  const { data } = await apiClient.post('/books', payload);
  return data;
}

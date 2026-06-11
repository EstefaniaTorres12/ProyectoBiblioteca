import { apiClient } from '../../shared/api/apiClient';
import { Loan } from '../../types/domain';

export async function getActiveLoans(): Promise<Loan[]> {
  const { data } = await apiClient.get('/loans/active');
  return data;
}

export async function returnLoan(id: number): Promise<Loan> {
  const { data } = await apiClient.patch(`/loans/${id}/return`);
  return data;
}

export interface CreateLoanPayload {
  userId: number;
  bookId: number;
  expectedReturnDate?: string;
}

export async function createLoan(payload: CreateLoanPayload): Promise<Loan> {
  const { data } = await apiClient.post('/loans', payload);
  return data;
}

export async function getLoansByUser(userId: number): Promise<Loan[]> {
  const { data } = await apiClient.get<Loan[]>(`/loans/user/${userId}`);
  return data;
}

export async function getOverdueLoans(): Promise<Loan[]> {
  const { data } = await apiClient.get<Loan[]>('/loans/overdue');
  return data;
}

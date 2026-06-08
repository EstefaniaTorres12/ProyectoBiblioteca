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

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  totalQuantity: number;
  availableQuantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Loan {
  id: number;
  userId: number;
  bookId: number;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'ACTIVO' | 'DEVUELTO' | 'VENCIDO';
  fineAmount: number;
  user?: User;
  book?: Book;
}

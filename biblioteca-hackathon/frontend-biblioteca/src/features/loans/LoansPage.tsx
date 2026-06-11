import { Alert, Button, Chip, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Book, Loan, User } from '../../types/domain';
import { getBooks } from '../books/books.api';
import { getUsers } from '../users/users.api';
import { CreateLoanPayload, createLoan, getActiveLoans, getOverdueLoans, returnLoan } from './loans.api';

export function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateLoanPayload>({ userId: 0, bookId: 0, expectedReturnDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOverdue, setShowOverdue] = useState(false);
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);

  async function loadLoans() {
    setLoans(await getActiveLoans());
  }

  async function loadBooks() {
    setBooks(await getBooks());
  }

  useEffect(() => {
    void loadLoans();
    void getUsers().then(setUsers);
    void loadBooks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createLoan({
        userId: form.userId,
        bookId: form.bookId,
        expectedReturnDate: form.expectedReturnDate
          ? new Date(form.expectedReturnDate).toISOString()
          : undefined,
      });
      setSuccess('Préstamo registrado correctamente');
      setForm({ userId: 0, bookId: 0, expectedReturnDate: '' });
      setShowForm(false);
      void loadLoans();
      void loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar el préstamo');
    }
  }

  async function handleReturn(id: number) {
    setError('');
    setSuccess('');
    try {
      const returned = await returnLoan(id);
      const fine = Number(returned.fineAmount);
      setSuccess(
        fine > 0
          ? `Devolución registrada. Multa: $${fine.toLocaleString('es-CO')}`
          : 'Devolución registrada sin multa'
      );
      void loadLoans();
      void loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar la devolución');
    }
  }

  async function handleToggleOverdue() {
    if (!showOverdue) {
      setOverdueLoans(await getOverdueLoans());
    }
    setShowOverdue(prev => !prev);
  }

  const availableBooks = books.filter((b) => b.availableQuantity > 0);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{showOverdue ? 'Préstamos vencidos' : 'Préstamos activos'}</Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
          {showForm ? 'Cancelar' : 'Registrar Préstamo'}
        </Button>
        <Button variant="outlined" color="warning" sx={{ alignSelf: 'flex-start' }} onClick={handleToggleOverdue}>
          {showOverdue ? 'Ver Activos' : 'Ver Vencidos'}
        </Button>
      </Stack>

      {showForm && (
        <Paper elevation={2} sx={{ maxWidth: 480, borderRadius: 2 }}>
          <Stack component="form" onSubmit={handleCreate} spacing={2} autoComplete="off" sx={{ p: 3 }}>
            <Typography variant="h6">Nuevo préstamo</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Usuario *"
              select
              value={form.userId || ''}
              onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}
              required
              fullWidth
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Libro *"
              select
              value={form.bookId || ''}
              onChange={(e) => setForm({ ...form, bookId: Number(e.target.value) })}
              required
              fullWidth
            >
              {availableBooks.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.title} ({b.availableQuantity} disponibles)</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Fecha devolución esperada"
              type="date"
              value={form.expectedReturnDate}
              onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">Guardar</Button>
              <Button variant="text" onClick={() => setShowForm(false)}>Cancelar</Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {success && <Alert severity="success">{success}</Alert>}

      {showOverdue ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'error.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Venció</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Días vencido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overdueLoans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No hay préstamos vencidos
                  </TableCell>
                </TableRow>
              )}
              {overdueLoans.map((loan) => {
                const diasVencido = Math.floor(
                  (Date.now() - new Date(loan.expectedReturnDate).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <TableRow key={loan.id} hover sx={{ backgroundColor: '#fdecea' }}>
                    <TableCell>{loan.book?.title ?? '—'}</TableCell>
                    <TableCell>{loan.user?.name ?? '—'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: 'error.main', fontWeight: 700 }}>{diasVencido} días</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Vence</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No hay registros
                  </TableCell>
                </TableRow>
              )}
              {loans.map((loan) => {
                const isOverdue = loan.status === 'ACTIVO' && new Date(loan.expectedReturnDate) < new Date();
                return (
                  <TableRow key={loan.id} hover sx={isOverdue ? { backgroundColor: '#fdecea' } : {}}>
                    <TableCell>{loan.book?.title ?? '—'}</TableCell>
                    <TableCell>{loan.user?.name ?? '—'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={isOverdue ? 'VENCIDO' : loan.status}
                        color={isOverdue ? 'error' : loan.status === 'ACTIVO' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {loan.status === 'ACTIVO' && (
                        <Button size="small" variant="outlined" onClick={() => handleReturn(loan.id)}>
                          Devolver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
